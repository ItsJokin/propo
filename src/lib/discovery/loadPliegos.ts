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
