// Código de referencia (producción) — sincronización diaria de oportunidades y alertas.
// Programado con Trigger.dev / cron a las 06:00 Europe/Madrid:
//   1. Descarga anuncios nuevos de TED y PLACSP (deduplicados por expediente y órgano).
//   2. Calcula la compatibilidad de cada anuncio con cada empresa con la MISMA función
//      determinista del MVP (src/lib/discovery/match.ts): sin IA, explicable y auditable.
//   3. Descarga y resume los pliegos de las oportunidades relevantes (./pliegos.ts).
//   4. Avisa de las coincidencias nuevas de cada alerta guardada (correo + aviso en la app).
import { createServiceClient } from '../supabase';
import { searchTed, type Opportunity } from './ted';
import { readPlacsp } from './placsp';
import { matchTender } from '../../src/lib/discovery/match';
import { fetchAndSummarize } from './pliegos';

const dedupeKey = (o: Opportunity) => `${o.buyer.toLowerCase().replace(/\W+/g, '')}|${o.title.toLowerCase().replace(/\W+/g, '').slice(0, 80)}`;

export async function syncOpportunities(step: (name: string, fn: () => Promise<any>) => Promise<any>) {
  const db = createServiceClient();
  const { data: last } = await db.from('sync_runs').select('finished_at').eq('ok', true).order('finished_at', { ascending: false }).limit(1).maybeSingle();
  const since = new Date(last?.finished_at ?? Date.now() - 7 * 864e5);

  const seen = new Set<string>();
  const batch: Opportunity[] = [];
  await step('fetch-ted', async () => {
    const ymd = since.toISOString().slice(0, 10).replace(/-/g, '');
    for await (const o of searchTed(ymd)) { const k = dedupeKey(o); if (!seen.has(k)) { seen.add(k); batch.push(o); } }
  });
  await step('fetch-placsp', async () => {
    for await (const o of readPlacsp(since.toISOString())) { const k = dedupeKey(o); if (!seen.has(k)) { seen.add(k); batch.push(o); } }
  });

  await step('upsert', async () => {
    for (let i = 0; i < batch.length; i += 500) {
      await db.from('opportunities').upsert(batch.slice(i, i + 500).map((o) => ({
        source: o.source, external_id: o.externalId, title: o.title, buyer: o.buyer, city: o.city, cpv: o.cpv, nuts: o.nuts,
        published_at: o.publishedAt, deadline: o.deadline, value_eur: o.valueEur, kind: o.kind, url: o.url, raw: o.raw,
      })), { onConflict: 'source,external_id' });
    }
  });

  await step('match-and-alert', async () => {
    const { data: companies } = await db.from('workspaces').select('id, industry, revenue, employees, cpvs, regions');
    const { data: fresh } = await db.from('opportunities').select('*').gte('created_at', since.toISOString());
    for (const c of companies ?? []) {
      const rows = (fresh ?? []).map((o: any) => {
        const m = matchTender({ id: o.external_id, title: o.title, buyer: o.buyer, city: o.city ?? '', cpv: o.cpv, nuts: o.nuts[0] ?? '', deadline: o.deadline ?? '', value: o.value_eur, pub: o.published_at ?? '', desc: '', kind: o.kind ?? '', nature: 'services', sector: '' }, c as any);
        return { workspace_id: c.id, opportunity_id: o.id, score: m.score, reasons: m.reasons };
      }).filter((r: { score: number }) => r.score >= 40);
      if (rows.length) await db.from('opportunity_matches').upsert(rows, { onConflict: 'workspace_id,opportunity_id' });
    }
    // Las alertas se evalúan en SQL (tender_alerts × opportunity_matches) y encolan un correo resumen
    // por alerta con las coincidencias nuevas; nunca más de un correo por alerta y día.
    await db.rpc('enqueue_alert_digests', { p_since: since.toISOString() });
  });

  await step('pliegos', async () => {
    const { data: relevant } = await db.from('opportunity_matches').select('opportunity_id').gte('score', 40).gte('computed_at', since.toISOString());
    for (const id of new Set((relevant ?? []).map((r: any) => r.opportunity_id))) await fetchAndSummarize(id as string);
  });

  await db.from('sync_runs').insert({ finished_at: new Date().toISOString(), ok: true, count: batch.length });
  return { fetched: batch.length };
}
