// Reference — OCR for scanned pages (Azure AI Document Intelligence "prebuilt-read", EU region).
// Only pages without a text layer are sent, to limit cost.
import type { ParsedDoc } from '../../src/lib/pipeline/parse';

export async function ocrPdf(name: string, buf: ArrayBuffer, parsed: ParsedDoc): Promise<ParsedDoc> {
  const endpoint = process.env.AZURE_DI_ENDPOINT!;
  const res = await fetch(`${endpoint}/documentintelligence/documentModels/prebuilt-read:analyze?api-version=2024-11-30`, {
    method: 'POST', headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_DI_KEY!, 'Content-Type': 'application/pdf' }, body: buf,
  });
  const poll = res.headers.get('operation-location')!;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const j = await (await fetch(poll, { headers: { 'Ocp-Apim-Subscription-Key': process.env.AZURE_DI_KEY! } })).json();
    if (j.status === 'succeeded') {
      const pages = j.analyzeResult.pages.map((p: any) => p.lines.map((l: any) => l.content).join('\n'));
      const merged = parsed.pages.map((t, i2) => (t.trim().length > 25 ? t : pages[i2] ?? t));
      return { ...parsed, pages: merged, status: 'parsed', note: 'Text recognised with OCR. Check scanned pages carefully.' };
    }
    if (j.status === 'failed') break;
  }
  return { ...parsed, status: 'unreadable', note: 'Text recognition failed for this document.' };
}
