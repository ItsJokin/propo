// Reference implementation — the document pipeline as background jobs (Trigger.dev / Inngest).
// Tender analysis takes 30 s to several minutes: it never runs inside a request.
//
//  upload (signed upload URL) ─► ingest ─► parse / OCR ─► chunk + metadata ─► embed
//        ─► extract requirements (LLM, structured) ─► validate quotes ─► match company knowledge
//        ─► build proposal structure ─► notify  ···  generate sections on demand ─► validate ─► human review
import { createServiceClient } from '../supabase';
import { extractBatch, embed } from '../ai/openaiProvider';
import { chunkPages, quoteOnPage } from '../../src/lib/pipeline/retrieval';
import { extractWithRules } from '../../src/lib/pipeline/extractRules';
import { matchRequirement } from '../../src/lib/pipeline/matching';
import { parseBuffer } from '../../src/lib/pipeline/parse';      // same parser; server adds OCR below
import { ocrPdf } from './ocr';                                    // Azure Document Intelligence / AWS Textract

type Ctx = { workspaceId: string; projectId: string; step: (name: string, fn: () => Promise<any>) => Promise<any>; progress: (p: object) => Promise<void> };

export async function analyzeProject(ctx: Ctx) {
  const db = createServiceClient();
  const { data: docs } = await db.from('source_documents').select('*').eq('project_id', ctx.projectId);
  const pagesByDoc = new Map<string, string[]>();

  // 1-2. Parse each file; OCR pages without a text layer
  for (const d of docs!) {
    await ctx.step(`parse:${d.id}`, async () => {
      const file = await db.storage.from('documents').download(d.storage_path);
      const buf = await file.data!.arrayBuffer();
      let parsed = await parseBuffer(d.name, buf, d.size_bytes / 1024);
      if (parsed.status === 'unreadable' || parsed.status === 'partial') parsed = await ocrPdf(d.name, buf, parsed);
      pagesByDoc.set(d.id, parsed.pages);
      await db.from('source_documents').update({ pages: parsed.pages.length, parse_status: parsed.status, note: parsed.note, ocr_used: parsed.status !== 'parsed' }).eq('id', d.id);
    });
  }
  await ctx.progress({ stage: 'read' });

  // 3-5. Chunk with metadata (doc, page, clause) and embed into pgvector
  await ctx.step('chunk-embed', async () => {
    for (const d of docs!) {
      const chunks = chunkPages(d.id, d.name, pagesByDoc.get(d.id) ?? []);
      for (let i = 0; i < chunks.length; i += 96) {
        const slice = chunks.slice(i, i + 96);
        const vectors = await embed(slice.map((c) => c.text));
        await db.from('document_chunks').insert(slice.map((c, j) => ({ workspace_id: ctx.workspaceId, project_id: ctx.projectId, source_document_id: d.id, page: c.page, content: c.text, embedding: vectors[j] as any })));
      }
    }
  });

  // 6. Extraction: relevance-ranked pages, batched; rules extractor as a cross-check
  const extraction = await ctx.step('extract', async () => { /* select pages (see src/lib/ai/engine.ts pickPages), call extractBatch per batch, merge */ });
  const rules = extractWithRules([...pagesByDoc].map(([id, pages]) => ({ id, name: docs!.find((d) => d.id === id)!.name, pages })));
  void rules; // requirements found by rules but not by the model are added with status needs_info + "found by wording"

  // 7-8. Validate every quote against its cited page; match company knowledge; persist
  await ctx.step('validate-match', async () => {
    const knowledge = await loadKnowledge(ctx.workspaceId);
    for (const r of (extraction as any).requirements) {
      const docId = docs!.find((d) => d.name === r.doc)?.id;
      const verified = quoteOnPage(pagesByDoc.get(docId!)?.[r.page - 1], r.quote);
      const m = matchRequirement({ ...r, docName: r.doc, match: r.match && { status: r.match.status, evidenceIds: r.match.evidence_ids, ask: r.match.ask } }, knowledge);
      await db.from('requirements').insert({ workspace_id: ctx.workspaceId, project_id: ctx.projectId, title: r.title, quote: r.quote, category: r.category, mandatory: r.mandatory, critical: r.critical, status: m.status, ask: m.ask, source_document_id: docId, source_page: r.page, source_clause: r.clause, quote_verified: verified, confidence: verified ? 0.9 : 0.55 });
    }
  });
  await db.from('projects').update({ stage: 'active' }).eq('id', ctx.projectId);
  await db.from('notifications').insert({ workspace_id: ctx.workspaceId, kind: 'ai_done', title: 'Analysis complete', project_id: ctx.projectId });
}

async function loadKnowledge(workspaceId: string): Promise<any> {
  const db = createServiceClient();
  const [company, pastProjects, certifications, team, vault] = await Promise.all([
    db.from('workspaces').select('*').eq('id', workspaceId).single(),
    db.from('past_projects').select('*').eq('workspace_id', workspaceId),
    db.from('certifications').select('*').eq('workspace_id', workspaceId),
    db.from('team_members').select('*').eq('workspace_id', workspaceId),
    db.from('vault_documents').select('*').eq('workspace_id', workspaceId),
  ]);
  return { company: company.data, pastProjects: pastProjects.data, certifications: certifications.data, team: team.data, vault: vault.data };
}
