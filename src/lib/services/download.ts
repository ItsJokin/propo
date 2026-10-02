// Offers a generated file to the user. Inside claude.ai the page uses the Artifact
// `downloads` capability (the viewer confirms the save). Elsewhere, a normal browser download.
export async function offerDownload(filename: string, data: Uint8Array | string): Promise<'saved' | 'declined' | 'unavailable'> {
  const c = (window as any).claude;
  if (c?.use) {
    try {
      const d = await c.use('downloads');
      if (d) {
        try { await d.save({ filename, data: typeof data === 'string' ? data : new Blob([data]) }); return 'saved'; }
        catch (e: any) { return e?.code === 'declined' ? 'declined' : 'unavailable'; }
      }
    } catch { /* fall through */ }
  }
  try {
    const blob = new Blob([data as any]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'saved';
  } catch { return 'unavailable'; }
}
