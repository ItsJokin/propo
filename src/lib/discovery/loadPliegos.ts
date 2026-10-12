// Carga los pliegos oficiales publicados junto a la app (pliegos/<id>/...) como archivos para el análisis.
import { PLIEGO_FILES } from './pliegoFiles';
import { getLive } from '../data/live';

/**
 * Dónde están los PDF: junto a la página (versión de claude.ai) o, en la web alojada, en el repositorio
 * público, servidos por jsDelivr con el tipo PDF correcto y permiso de lectura desde el navegador.
 */
export function pliegoUrl(path: string) {
  const repo = getLive().meta?.repo;
  return repo ? `https://cdn.jsdelivr.net/gh/${repo}@main/${path.split('/').map(encodeURIComponent).join('/')}` : path;
}

export function hasPliegos(id: string) { return (PLIEGO_FILES[id]?.length ?? 0) > 0; }

export async function loadPliegoFiles(id: string, onProgress?: (msg: string) => void): Promise<File[]> {
  const out: File[] = [];
  for (const f of PLIEGO_FILES[id] ?? []) {
    onProgress?.(`Descargando ${f.name}`);
    try {
      const r = await fetch(pliegoUrl(f.path));
      if (!r.ok) continue;
      const buf = await r.arrayBuffer();
      out.push(new File([buf], f.name, { type: f.path.endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream' }));
    } catch { /* sigue con el resto */ }
  }
  return out;
}

/** Dirección del servidor de pliegos (worker-pliegos/). La fija la compilación; vacía = sin descarga automática. */
const PLIEGOS_URL = String(process.env.PROPO_PLIEGOS_URL || '').replace(/\/+$/, '');
const MAX_DOCS = 6;

type LiveDoc = [name: string, url: string, kind: string];
/** Los documentos que merece la pena leer: primero los pliegos (PCAP, PPT) y después el resto, hasta MAX_DOCS. */
function worthReading(docs: LiveDoc[]): LiveDoc[] {
  const rank = (d: LiveDoc) => (d[2] === 'pcap' ? 0 : d[2] === 'ppt' ? 1 : 2);
  return [...docs].filter((d) => /^https:\/\//.test(d[1])).sort((a, b) => rank(a) - rank(b)).slice(0, MAX_DOCS);
}

/** ¿Puede PROPO traer por sí mismo los pliegos de esta licitación? */
export function canFetchDocs(docs: LiveDoc[] | undefined) { return !!PLIEGOS_URL && !!docs && worthReading(docs).length > 0; }

/** Descarga los pliegos oficiales de una licitación en directo a través del servidor de pliegos. */
export async function loadLiveDocs(docs: LiveDoc[] | undefined, onProgress?: (msg: string) => void): Promise<File[]> {
  if (!canFetchDocs(docs)) return [];
  const out: File[] = [];
  for (const [name, url] of worthReading(docs!)) {
    onProgress?.(`Descargando ${name.length > 40 ? name.slice(0, 38) + '…' : name}`);
    try {
      const r = await fetch(`${PLIEGOS_URL}/pliego?u=${encodeURIComponent(url)}`);
      if (!r.ok) continue;
      const type = (r.headers.get('Content-Type') || '').split(';')[0].trim();
      if (/^text\/html/.test(type)) continue;                      // una página de la plataforma, no un documento
      const buf = await r.arrayBuffer();
      const pdf = type === 'application/pdf' || new TextDecoder().decode(buf.slice(0, 5)) === '%PDF-';
      const clean = name.replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'Pliego';
      out.push(new File([buf], pdf && !/\.pdf$/i.test(clean) ? clean + '.pdf' : clean, { type: pdf ? 'application/pdf' : type || 'application/octet-stream' }));
    } catch { /* sigue con el resto */ }
  }
  return out;
}
