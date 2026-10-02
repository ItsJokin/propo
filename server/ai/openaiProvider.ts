// Reference implementation — server-side AI provider (OpenAI). Keys never reach the browser.
// The browser MVP uses the same prompts (src/lib/ai/prompts.ts) through a different transport.
import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { extractionPrompt, sectionPrompt, PROMPT_VERSION } from '../../src/lib/ai/prompts';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Use the provider's EU data residency / zero-data-retention options where the account allows.
const MODEL_EXTRACT = process.env.AI_MODEL_EXTRACT ?? 'gpt-4.1';
const MODEL_DRAFT = process.env.AI_MODEL_DRAFT ?? 'gpt-4.1';
const MODEL_CHEAP = process.env.AI_MODEL_CHEAP ?? 'gpt-4.1-mini';
const EMBED = 'text-embedding-3-small'; // 1536 dims, matches vector(1536)

const Requirement = z.object({
  title: z.string(), category: z.enum(['administrative', 'technical', 'financial', 'experience', 'certification', 'format', 'legal', 'team']),
  quote: z.string(), doc: z.string(), page: z.number().int(), clause: z.string().nullable(),
  mandatory: z.boolean(), critical: z.boolean(),
  match: z.object({ status: z.enum(['fulfilled', 'needs_info', 'missing']), evidence_ids: z.array(z.string()), ask: z.string().nullable() }),
});
export const Extraction = z.object({
  summary: z.string(), authority: z.string().nullable(), reference: z.string().nullable(), cpv: z.string().nullable(),
  budget: z.string().nullable(), duration: z.string().nullable(), submission_deadline: z.string().nullable(),
  deadlines: z.array(z.object({ label: z.string(), date: z.string(), doc: z.string(), page: z.number().int() })),
  page_limit: z.string().nullable(),
  requirements: z.array(Requirement),
  criteria: z.array(z.object({ group: z.string(), name: z.string(), points: z.number(), kind: z.enum(['judgement', 'formula']), description: z.string(), doc: z.string(), page: z.number().int() })),
  required_documents: z.array(z.string()),
  exclusion_risks: z.array(z.object({ text: z.string(), doc: z.string(), page: z.number().int() })),
  proposal_structure: z.array(z.object({ title: z.string(), guidance: z.string(), criteria: z.array(z.string()) })),
});

export async function extractBatch(knowledgeJson: string, pagesBlock: string, batch: number, total: number) {
  const r = await client.chat.completions.parse({
    model: MODEL_EXTRACT,
    temperature: 0,
    messages: [{ role: 'user', content: extractionPrompt(knowledgeJson, pagesBlock, batch, total) }],
    response_format: zodResponseFormat(Extraction, 'extraction'),   // structured outputs: schema-valid JSON
  });
  return { data: r.choices[0].message.parsed!, usage: r.usage, model: MODEL_EXTRACT, promptVersion: PROMPT_VERSION };
}

export const Section = z.object({ content: z.string(), missing: z.array(z.string()), confidence: z.number() });
export async function draftSection(args: Parameters<typeof sectionPrompt>[0]) {
  const r = await client.chat.completions.parse({
    model: MODEL_DRAFT, temperature: 0.3,
    messages: [{ role: 'user', content: sectionPrompt(args) }],
    response_format: zodResponseFormat(Section, 'section'),
  });
  return { data: r.choices[0].message.parsed!, usage: r.usage, model: MODEL_DRAFT, promptVersion: PROMPT_VERSION };
}

export async function embed(texts: string[]) {
  const r = await client.embeddings.create({ model: EMBED, input: texts });
  return r.data.map((d) => d.embedding);
}

export async function chat(messages: { role: 'user' | 'assistant'; content: string }[]) {
  return client.chat.completions.create({ model: MODEL_CHEAP, temperature: 0.2, messages, stream: true });
}

// Cost control (per proposal): ~300 pages -> pre-filter by relevance to <= 120k tokens,
// 1-3 extraction calls, embeddings once per document, drafts only on user action.
// Every call writes a row to `ai_usage`; the plan's aiActionsPerProposal cap is enforced before calling.

// Resumen de los pliegos de una licitación (buscador). Cada dato lleva documento, página y cita literal,
// que server/discovery/pliegos.ts valida contra el texto antes de guardarlo.
const Ref = z.object({ doc: z.string(), page: z.number().int(), quote: z.string() });
export const TenderSummary = z.object({
  plain: z.string(),
  facts: z.array(z.object({ label: z.string(), value: z.string(), ref: Ref })),
  asks: z.array(z.object({ text: z.string(), ref: Ref })),
  watch: z.array(z.object({ text: z.string(), ref: Ref })),
  criteria: z.array(z.object({ name: z.string(), weight: z.number().nullable(), price: z.boolean() })),
});
export async function summarizeTender(args: { title: string; buyer: string; documents: { name: string; pages: string[] }[] }) {
  const block = args.documents.map((d) => d.pages.map((p, i) => `<<<DOC "${d.name}" | PAGE ${i + 1}>>>\n${p}`).join('\n\n')).join('\n\n').slice(0, 400_000);
  const r = await client.chat.completions.parse({
    model: MODEL_EXTRACT, temperature: 0,
    messages: [{ role: 'user', content: `Resume en español, para una pyme que decide si presentarse, la licitación «${args.title}» de ${args.buyer}.
Reglas: usa solo lo que dicen los documentos; cada dato con su documento, página y una cita literal corta; si un dato no aparece, no lo incluyas.
plain: 2-3 frases sencillas (qué se contrata, alcance, duración). facts: presupuesto, valor estimado, duración, garantías, plazo, criterios.
asks: qué hay que acreditar o cumplir (solvencia, medios, certificados, requisitos técnicos clave). watch: causas de exclusión, penalidades, subrogación, plazos cortos, umbrales de baja.
DOCUMENTOS:\n${block}` }],
    response_format: zodResponseFormat(TenderSummary, 'tender_summary'),
  });
  return { ...r.choices[0].message.parsed!, model: MODEL_EXTRACT };
}
