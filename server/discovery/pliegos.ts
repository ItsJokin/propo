// Código de referencia (producción) — descarga y resumen automático de los pliegos de cada licitación.
// Es la versión automática de lo que el MVP muestra en src/lib/discovery/tenderDocs.ts (pliegos leídos
// el 1/10/2026 en las plataformas oficiales). Se ejecuta tras syncOpportunities() para cada oportunidad nueva
// con compatibilidad ≥ 40 en algún espacio, y bajo demanda cuando un usuario abre una licitación.
//
//   PLACSP: deeplink del anuncio → fila «Pliego» (HTML «Documento de pliegos») → enlaces al PCAP y al PPT
//           (GetDocumentByIdServlet) + datos estructurados (presupuesto, solvencia, garantías, condiciones).
//   PSCP:   /portal-api/detall-publicacio-expedient/{id} → plecsDeClausulesAdministratives, plecsDePrescripcionsTecniques…
//           → /portal-api/descarrega-document/{docId}/{hash}
//
// Los documentos se guardan en el bucket privado `opportunity-docs` (son públicos, pero se sirven con URL
// firmada para no depender de la disponibilidad de la plataforma). El resumen lo genera el modelo con
// salida estructurada y cada dato lleva su referencia (documento + página); las referencias se validan
// contra el texto (quoteOnPage) y lo que no se puede verificar se descarta.
import { createServiceClient } from '../supabase';
import { parseBuffer } from '../../src/lib/pipeline/parse';
import { quoteOnPage } from '../../src/lib/pipeline/retrieval';
import { summarizeTender } from '../ai/openaiProvider';

const UA = { 'user-agent': 'PROPO/1.0 (+https://propo.example/bot; contacto@propo.example)' };

export interface FoundDoc { name: string; url: string; kind: 'pcap' | 'ppt' | 'anexo' | 'otro' }

export async function placspDocs(deeplink: string): Promise<FoundDoc[]> {
  const html = await (await fetch(deeplink, { headers: UA })).text();
  const pliego = [...html.matchAll(/href="([^"]*GetDocumentByIdServlet[^"]+)"[^>]*>[\s\S]{0,400}?Documento html/g)]
    .map((m) => m[1].replace(/&amp;/g, '&'))
    .find(Boolean);
  if (!pliego) return [];
  const body = await (await fetch(new URL(pliego, deeplink), { headers: UA })).text();
  return [...body.matchAll(/<a[^>]+href="([^"]*GetDocumentByIdServlet[^"]+)"[^>]*>([^<]{3,120})<\/a>/g)].map(([, href, name]) => ({
    name: name.trim(), url: new URL(href.replace(/&amp;/g, '&'), deeplink).toString(),
    kind: /Administrativ/i.test(name) ? 'pcap' : /Prescripciones|T[ée]cnic/i.test(name) ? 'ppt' : /Anexo/i.test(name) ? 'anexo' : 'otro',
  }));
}

export async function pscpDocs(publicationId: number): Promise<FoundDoc[]> {
  const j: any = await (await fetch(`https://contractaciopublica.cat/portal-api/detall-publicacio-expedient/${publicationId}`, { headers: UA })).json();
  const d = j?.dades?.publicacio?.dadesPublicacio ?? {};
  const map = (x: any, kind: FoundDoc['kind']) => (x?.docs ?? []).map((doc: any) => ({ name: doc.titol, url: `https://contractaciopublica.cat/portal-api/descarrega-document/${doc.id}/${doc.hash}`, kind }));
  return [...map(d.plecsDeClausulesAdministratives, 'pcap'), ...map(d.plecsDePrescripcionsTecniques, 'ppt'), ...map(d.altresDocuments, 'otro')];
}

export async function fetchAndSummarize(opportunityId: string) {
  const db = createServiceClient();
  const { data: o } = await db.from('opportunities').select('*').eq('id', opportunityId).single();
  if (!o) return;
  const docs = o.source === 'placsp' || /contrataciondelestado/.test(o.url) ? await placspDocs(o.url)
    : /contractaciopublica/.test(o.url) && o.raw?.pscpId ? await pscpDocs(o.raw.pscpId) : [];
  const texts: { name: string; pages: string[] }[] = [];
  for (const doc of docs.filter((x) => x.kind === 'pcap' || x.kind === 'ppt')) {
    const res = await fetch(doc.url, { headers: UA });
    if (!res.ok) continue;
    const buf = await res.arrayBuffer();
    const path = `${opportunityId}/${doc.kind}-${Date.now()}.pdf`;
    await db.storage.from('opportunity-docs').upload(path, buf, { contentType: 'application/pdf', upsert: true });
    const parsed = await parseBuffer(doc.name, buf, buf.byteLength / 1024);
    texts.push({ name: doc.name, pages: parsed.pages });
    await db.from('opportunity_documents').upsert({ opportunity_id: opportunityId, name: doc.name, kind: doc.kind, source_url: doc.url, storage_path: path, pages: parsed.pages.length }, { onConflict: 'opportunity_id,source_url' });
  }
  if (!texts.length) return;
  // Resumen estructurado: { plain, facts[{label,value,ref}], asks[{text,ref}], watch[{text,ref}], criteria[{name,weight,price}] }
  const s = await summarizeTender({ title: o.title, buyer: o.buyer, documents: texts });
  const verified = (items: { text: string; ref: { doc: string; page: number; quote: string } }[]) =>
    items.filter((i) => { const d = texts.find((t) => t.name === i.ref.doc); return d && quoteOnPage(i.ref.quote, d.pages[i.ref.page - 1] ?? ''); });
  await db.from('opportunity_briefs').upsert({
    opportunity_id: opportunityId, plain: s.plain, facts: s.facts, asks: verified(s.asks), watch: verified(s.watch), criteria: s.criteria,
    read_from: texts.map((t) => t.name), model: s.model, created_at: new Date().toISOString(),
  });
}
