// Memoria técnica en Word (.docx) para que el licitador la retoque en su editor, con el mismo sistema de diseño que el
// PDF (design/theme): portada con su marca, índice automático, cabecera y pie numerados, tablas con estilo, procesos,
// compromisos verificables y modo anónimo. Un .docx es un ZIP con XML: se escribe a mano, sin dependencias.
import type { AppState, Project } from './types';
import { writeZip } from './pipeline/zip';
import { fmtDate, nowIso, isUnknown } from './util';
import { richBlocks } from './richBlocks';
import { themeFor, toHex, TYPE, type DocTheme } from './design/theme';

const enc = new TextEncoder();
const esc = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (content: string) => content.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g, '[INFORMACIÓN REQUERIDA: $1]');
const hp = (pt: number) => Math.round(pt * 2);   // medios puntos
const FONT = 'Arial';

const run = (t: string, rpr = '') => `<w:r>${rpr ? `<w:rPr>${rpr}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
/** Runs con negritas de Markdown (**texto**). */
const runs = (text: string, rpr = '') => text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((x) => (x.startsWith('**') && x.endsWith('**') ? run(x.slice(2, -2), `<w:b/>${rpr}`) : run(x, rpr))).join('');
const para = (text: string, style?: string, ppr = '', rpr = '') => `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${ppr}</w:pPr>${runs(text, rpr)}</w:p>`;

function styles(t: DocTheme) {
  const P = t.palette; const H = toHex(P.heading); const A = toHex(P.accentInk); const M = toHex(P.muted);
  const serif = t.serifTitles ? `<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>` : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/><w:color w:val="${toHex(P.ink)}"/><w:sz w:val="${hp(TYPE.body)}"/><w:lang w:val="es-ES"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="${Math.round(240 * TYPE.leading * 0.92)}" w:lineRule="auto"/><w:widowControl/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Kicker"><w:name w:val="Antetítulo"/><w:basedOn w:val="Normal"/><w:next w:val="Heading1"/><w:pPr><w:keepNext/><w:spacing w:before="0" w:after="40"/></w:pPr><w:rPr><w:b/><w:caps/><w:color w:val="${A}"/><w:spacing w:val="10"/><w:sz w:val="${hp(TYPE.kicker)}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:keepLines/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="8" w:color="${toHex(P.line)}"/></w:pBdr><w:spacing w:before="0" w:after="260" w:line="260" w:lineRule="auto"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr>${serif}<w:b/><w:color w:val="${H}"/><w:sz w:val="${hp(TYPE.h1)}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:keepLines/><w:pBdr><w:left w:val="single" w:sz="18" w:space="6" w:color="${toHex(P.primary)}"/></w:pBdr><w:spacing w:before="280" w:after="100"/><w:ind w:left="120"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="${H}"/><w:sz w:val="${hp(TYPE.h2)}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="60"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="${hp(TYPE.h3)}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Caption"><w:name w:val="caption"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="${M}"/><w:sz w:val="${hp(TYPE.caption)}"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="TOC1"><w:name w:val="toc 1"/><w:basedOn w:val="Normal"/><w:pPr><w:tabs><w:tab w:val="right" w:leader="dot" w:pos="9060"/></w:tabs><w:spacing w:after="100"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Header"><w:name w:val="header"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0"/></w:pPr><w:rPr><w:color w:val="${M}"/><w:sz w:val="15"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Footer"><w:name w:val="footer"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="0"/></w:pPr><w:rPr><w:color w:val="${M}"/><w:sz w:val="15"/></w:rPr></w:style>
<w:style w:type="table" w:styleId="PropoTable"><w:name w:val="Tabla PROPO"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="12" w:color="${toHex(P.primary)}"/><w:bottom w:val="single" w:sz="6" w:color="${toHex(P.primary)}"/><w:insideH w:val="single" w:sz="4" w:color="${toHex(P.line)}"/></w:tblBorders><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr><w:rPr><w:sz w:val="${hp(8.8)}"/></w:rPr></w:style>
</w:styles>`;
}

/** Tabla con cabecera repetida en cada página, cebrado y números a la derecha. */
function tableXml(t: DocTheme, head: string[], rows: string[][], widths?: number[]) {
  const P = t.palette; const total = 9060;
  const len = head.map((h, i) => Math.max(h.length, ...rows.map((r) => Math.min(60, (r[i] ?? '').length))));
  const sum = len.reduce((a, n) => a + n, 0) || 1;
  const ws = widths ?? len.map((n) => Math.max(900, Math.round((n / sum) * total)));
  const num = head.map((_, i) => rows.length > 0 && rows.filter((r) => (r[i] ?? '').trim()).every((r) => /^[\s\-+]?[\d.,\s]+\s*(€|%|h|d[ií]as?|meses|años|m²|m2|km)?$/i.test(r[i].trim())));
  const cell = (s: string, i: number, hdr: boolean, zebra: boolean) => `<w:tc><w:tcPr><w:tcW w:w="${ws[i]}" w:type="dxa"/>${hdr ? `<w:shd w:val="clear" w:color="auto" w:fill="${toHex(P.soft)}"/>` : zebra ? `<w:shd w:val="clear" w:color="auto" w:fill="${toHex(P.softer)}"/>` : ''}</w:tcPr><w:p><w:pPr><w:spacing w:after="0" w:line="252" w:lineRule="auto"/>${num[i] ? '<w:jc w:val="right"/>' : ''}</w:pPr>${runs(hdr ? s.toUpperCase() : s, hdr ? `<w:b/><w:color w:val="${toHex(P.heading)}"/><w:sz w:val="15"/>` : `<w:sz w:val="${hp(8.8)}"/>${i === 0 ? '<w:b/>' : ''}`)}</w:p></w:tc>`;
  return `<w:tbl><w:tblPr><w:tblStyle w:val="PropoTable"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${ws.map((x) => `<w:gridCol w:w="${x}"/>`).join('')}</w:tblGrid>`
    + `<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>${head.map((h, i) => cell(h, i, true, false)).join('')}</w:tr>`
    + rows.map((r, k) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${head.map((_, i) => cell(r[i] ?? '', i, false, k % 2 === 1)).join('')}</w:tr>`).join('')
    + `</w:tbl><w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>`;
}
/** Cuadro con fondo suave y filete a la izquierda (criterio valorado, mejoras). */
const boxPara = (t: DocTheme, label: string, lines: string[], tone: 'brand' | 'accent' = 'brand') => {
  const P = t.palette; const bar = toHex(tone === 'accent' ? P.accent : P.primary); const fill = toHex(tone === 'accent' ? P.softer : P.softer);
  const ppr = (first: boolean, last: boolean) => `<w:pBdr><w:left w:val="single" w:sz="18" w:space="10" w:color="${bar}"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="${fill}"/><w:spacing w:before="${first ? 120 : 0}" w:after="${last ? 200 : 40}"/><w:ind w:left="200" w:right="120"/>`;
  return [para(label, undefined, ppr(true, false) + '<w:keepNext/>', `<w:b/><w:caps/><w:color w:val="${toHex(P.heading)}"/><w:sz w:val="14"/>`), ...lines.map((l, i) => para(l, undefined, ppr(false, i === lines.length - 1)))].join('');
};

function pngSize(b64: string): [number, number] | null {
  try { const bin = atob(b64.slice(0, 64)); if (bin.slice(1, 4) !== 'PNG') return null; const u = (i: number) => (bin.charCodeAt(i) << 24) | (bin.charCodeAt(i + 1) << 16) | (bin.charCodeAt(i + 2) << 8) | bin.charCodeAt(i + 3); return [u(16), u(20)]; } catch { return null; }
}
/** Imagen en línea (el logo), con su proporción. */
function drawing(rid: string, wPx: number, hPx: number, maxWcm: number, maxHcm: number, id: number) {
  const k = Math.min((maxWcm * 360000) / wPx, (maxHcm * 360000) / hPx); const cx = Math.round(wPx * k), cy = Math.round(hPx * k);
  return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${id}" name="Logo ${id}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="logo.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

export function technicalProposalDocx(p: Project, s: AppState): Uint8Array {
  const c = s.company; const t = themeFor(c, p, { technical: true }); const P = t.palette; const anon = t.anonymous;
  const ref = !isUnknown(p.analysis?.reference) ? p.analysis!.reference : p.tender?.live?.ref || '';
  const title = p.name.endsWith('…') && p.tender?.title ? p.tender.title.replace(/\s+/g, ' ').trim() : p.name;
  const logoB64 = !anon && /^data:image\/png;base64,/.test(c.logo || '') ? c.logo!.split(',')[1] : null;
  const logoDim = logoB64 ? pngSize(logoB64) : null;
  const body: string[] = [];

  // ── Portada: bloque de color a todo el ancho con antetítulo y título; logo arriba; ficha del contrato debajo.
  if (logoB64 && logoDim) body.push(`<w:p><w:pPr><w:spacing w:after="600"/></w:pPr>${drawing('rIdLogo', logoDim[0], logoDim[1], 6, 2.2, 1)}</w:p>`);
  else if (!anon) body.push(para(c.tradeName || c.legalName || '', undefined, '<w:spacing w:after="600"/>', `<w:b/><w:color w:val="${toHex(P.heading)}"/><w:sz w:val="28"/>`));
  else body.push('<w:p><w:pPr><w:spacing w:after="600"/></w:pPr></w:p>');
  const band = (inner: string) => `<w:tbl><w:tblPr><w:tblW w:w="9060" w:type="dxa"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="single" w:sz="36" w:color="${toHex(P.accent)}"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders><w:tblCellMar><w:top w:w="500" w:type="dxa"/><w:left w:w="420" w:type="dxa"/><w:bottom w:w="560" w:type="dxa"/><w:right w:w="420" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="9060"/></w:tblGrid><w:tr><w:trPr><w:trHeight w:val="5200"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="9060" w:type="dxa"/><w:shd w:val="clear" w:color="auto" w:fill="${toHex(P.primary)}"/><w:vAlign w:val="bottom"/></w:tcPr>${inner}</w:tc></w:tr></w:tbl>`;
  const on = toHex(P.onPrimary);
  body.push(band(para('Memoria técnica', undefined, '<w:spacing w:after="160"/>', `<w:b/><w:caps/><w:spacing w:val="20"/><w:color w:val="${on}"/><w:sz w:val="18"/>`)
    + para(title, undefined, '<w:spacing w:after="0" w:line="240" w:lineRule="auto"/>', `${t.serifTitles ? '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>' : ''}<w:b/><w:color w:val="${on}"/><w:sz w:val="${title.length > 110 ? 34 : title.length > 60 ? 44 : 56}"/>`)));
  body.push('<w:p><w:pPr><w:spacing w:after="360"/></w:pPr></w:p>');
  const meta: [string, string][] = [['Órgano de contratación', p.organization], ['Expediente', ref], ...(anon ? [] : [['Licitador', `${c.legalName || '[razón social]'}${c.taxId ? ` · NIF ${c.taxId}` : ''}`], ['Domicilio', c.address]] as [string, string][]), ['Fecha', fmtDate(nowIso())]];
  for (const [k, v] of meta.filter(([, v]) => v && v.trim())) {
    body.push(para(k, undefined, '<w:spacing w:after="0"/>', `<w:b/><w:caps/><w:color w:val="${toHex(P.muted)}"/><w:sz w:val="14"/>`));
    body.push(para(v, undefined, '<w:spacing w:after="160"/>'));
  }
  if (anon) body.push(para('Documento sin identificación del licitador, como exige el pliego.', 'Caption'));
  // Fin de la portada: sección propia sin cabecera ni pie.
  body.push(`<w:p><w:pPr><w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/><w:titlePg/></w:sectPr></w:pPr></w:p>`);

  // ── Índice automático (Word lo actualiza al abrir).
  body.push(para('Contenido', 'Kicker'));
  body.push(para('Índice', undefined, '<w:spacing w:after="300"/>', `${t.serifTitles ? '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>' : ''}<w:b/><w:color w:val="${toHex(P.heading)}"/><w:sz w:val="${hp(TYPE.h1)}"/>`));   // fuera del índice
  body.push(`<w:p><w:r><w:fldChar w:fldCharType="begin" w:dirty="true"/></w:r><w:r><w:instrText xml:space="preserve"> TOC \\o "1-1" \\h \\z \\u </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r>${run('Pulsa F9 (o «Actualizar campo») para ver el índice.', `<w:color w:val="${toHex(P.muted)}"/>`)}<w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>`);

  // ── Criterios de juicio de valor y dónde se responde cada uno.
  const judged = p.criteria.filter((k) => k.kind === 'judgement');
  const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  if (judged.length) {
    body.push(pageBreak, para('Correspondencia con los criterios', 'Heading1'));
    body.push(para('La memoria sigue los criterios sujetos a juicio de valor del pliego. La tabla indica en qué apartado se responde a cada uno.'));
    body.push(tableXml(t, ['Criterio', 'Puntos', 'Se responde en'], judged.map((k) => {
      const secs = p.sections.map((x, i) => ({ x, i })).filter(({ x }) => x.criteria.includes(k.id) || k.addressedBy.includes(x.id));
      return [k.name, String(k.points).replace('.', ','), secs.length ? secs.map(({ x, i }) => `${i + 1}. ${x.title}`).join('; ') : 'Conjunto de la memoria'];
    }), [4400, 1100, 3560]));
  }

  // ── Apartados.
  p.sections.forEach((sec, i) => {
    body.push(pageBreak);
    body.push(para(`Apartado ${i + 1}`, 'Kicker'));
    body.push(para(`${i + 1}. ${sec.title}`, 'Heading1'));
    if (sec.status !== 'approved') body.push(para('BORRADOR — sección sin aprobar', undefined, '', '<w:b/><w:color w:val="B45309"/><w:sz w:val="15"/>'));
    const crit = p.criteria.filter((k) => sec.criteria.includes(k.id));
    if (crit.length) body.push(boxPara(t, crit.length > 1 ? 'Criterios que se valoran en este apartado' : 'Criterio que se valora en este apartado', [crit.map((k) => `${k.name} (${String(k.points).replace('.', ',')} puntos)`).join(' · ')]));
    if (!sec.content.trim()) { body.push(para('[Sección todavía sin redactar]', undefined, '', '<w:i/><w:color w:val="B45309"/>')); return; }
    let mode: 'normal' | 'commit' | 'plus' = 'normal'; let heading = '';
    for (const b of richBlocks(plain(sec.content))) {
      if (b.type === 'h') {
        heading = b.text; mode = /compromisos verificables/i.test(b.text) ? 'commit' : /mejoras? sobre lo exigido|mejoras ofertadas/i.test(b.text) ? 'plus' : 'normal';
        if (mode !== 'commit') body.push(para(b.text, b.level === 2 ? 'Heading2' : 'Heading3'));
      } else if (b.type === 'table') body.push(tableXml(t, b.head.map((h) => h.replace(/\*\*/g, '')), b.rows.map((r) => r.map((x) => x.replace(/\*\*/g, '')))));
      else if (b.type === 'ul' || b.type === 'ol') {
        if (mode === 'commit') {
          // Compromisos: tabla de una columna con casillas, para localizarlos de un vistazo.
          body.push(`<w:tbl><w:tblPr><w:tblW w:w="9060" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="18" w:color="${toHex(P.primary)}"/><w:left w:val="single" w:sz="4" w:color="${toHex(P.soft)}"/><w:bottom w:val="single" w:sz="4" w:color="${toHex(P.soft)}"/><w:right w:val="single" w:sz="4" w:color="${toHex(P.soft)}"/></w:tblBorders><w:tblCellMar><w:top w:w="140" w:type="dxa"/><w:left w:w="220" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:right w:w="220" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid><w:gridCol w:w="9060"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc><w:tcPr><w:tcW w:w="9060" w:type="dxa"/></w:tcPr>`
            + para(heading, undefined, '<w:spacing w:after="100"/>', `<w:b/><w:caps/><w:color w:val="${toHex(P.heading)}"/><w:sz w:val="15"/>`)
            + b.items.map((it) => `<w:p><w:pPr><w:spacing w:after="80"/><w:ind w:left="360" w:hanging="360"/></w:pPr>${run('✓  ', `<w:b/><w:color w:val="${toHex(P.deep)}"/>`)}${runs(it)}</w:p>`).join('')
            + `</w:tc></w:tr></w:tbl><w:p><w:pPr><w:spacing w:after="120"/></w:pPr></w:p>`);
        } else if (mode === 'plus') body.push(boxPara(t, 'Valor añadido de la oferta', b.items.map((x) => `• ${x}`), 'accent'));
        else if (b.type === 'ol') b.items.forEach((it, k) => body.push(`<w:p><w:pPr><w:spacing w:after="90"/><w:ind w:left="480" w:hanging="480"/></w:pPr>${run(`${k + 1}  `, `<w:b/><w:color w:val="${toHex(P.deep)}"/><w:sz w:val="${hp(11)}"/>`)}${runs(it)}</w:p>`));
        else b.items.forEach((it) => body.push(`<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="360" w:hanging="240"/></w:pPr>${run('■  ', `<w:color w:val="${toHex(P.accent)}"/><w:sz w:val="12"/>`)}${runs(it)}</w:p>`));
      } else if (mode === 'plus') body.push(boxPara(t, 'Valor añadido de la oferta', [b.text], 'accent'));
      else body.push(para(b.text));
    }
  });

  // ── Anexo de equipo (no con anonimato).
  if (!anon && s.team.length) {
    body.push(pageBreak, para('Anexo', 'Kicker'), para('Equipo adscrito al contrato', 'Heading1'));
    body.push(tableXml(t, ['Nombre', 'Función', 'Experiencia', 'Titulación y cualificación'], s.team.map((m) => [m.name, m.role, m.years ? `${m.years} años` : '—', m.qualifications || '—']), [2200, 2600, 1300, 2960]));
  }

  const footRight = `<w:p><w:pPr><w:pStyle w:val="Footer"/><w:pBdr><w:top w:val="single" w:sz="4" w:space="6" w:color="${toHex(P.line)}"/></w:pBdr><w:tabs><w:tab w:val="right" w:pos="9638"/></w:tabs></w:pPr>${run(anon ? 'Memoria técnica' : `${c.legalName || ''}  ·  Memoria técnica`)}<w:r><w:tab/></w:r>${run('■ ', `<w:color w:val="${toHex(P.accent)}"/>`)}<w:r><w:rPr><w:b/><w:color w:val="${toHex(P.heading)}"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:b/><w:color w:val="${toHex(P.heading)}"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:b/><w:color w:val="${toHex(P.heading)}"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:b/><w:color w:val="${toHex(P.heading)}"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:b/><w:color w:val="${toHex(P.heading)}"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p>`;
  const headerXml = `<w:p><w:pPr><w:pStyle w:val="Header"/><w:pBdr><w:bottom w:val="single" w:sz="4" w:space="6" w:color="${toHex(P.line)}"/></w:pBdr><w:tabs><w:tab w:val="right" w:pos="9638"/></w:tabs></w:pPr>${run(anon ? 'Memoria técnica' : (c.tradeName || c.legalName || ''), `<w:b/><w:color w:val="${toHex(P.heading)}"/>`)}<w:r><w:tab/></w:r>${run(title.length > 70 ? title.slice(0, 68) + '…' : title)}</w:p>`;
  const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${NS}><w:body>${body.join('')}<w:sectPr><w:headerReference w:type="default" r:id="rIdH"/><w:footerReference w:type="default" r:id="rIdF"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1418" w:right="1134" w:bottom="1304" w:left="1247" w:header="567" w:footer="567" w:gutter="0"/><w:pgNumType w:start="1"/></w:sectPr></w:body></w:document>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/styles" Target="styles.xml"/><Relationship Id="rIdS" Type="${R}/settings" Target="settings.xml"/><Relationship Id="rIdH" Type="${R}/header" Target="header1.xml"/><Relationship Id="rIdF" Type="${R}/footer" Target="footer1.xml"/>${logoB64 ? `<Relationship Id="rIdLogo" Type="${R}/image" Target="media/logo.png"/>` : ''}</Relationships>`;
  const settings = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:updateFields w:val="true"/><w:defaultTabStop w:val="708"/><w:characterSpacingControl w:val="doNotCompress"/></w:settings>`;
  const part = (tagName: string, inner: string) => `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<w:${tagName} ${NS}>${inner}</w:${tagName}>`;
  const files = [
    { name: '[Content_Types].xml', data: enc.encode(types) },
    { name: '_rels/.rels', data: enc.encode(rels) },
    { name: 'word/document.xml', data: enc.encode(doc) },
    { name: 'word/styles.xml', data: enc.encode(styles(t)) },
    { name: 'word/settings.xml', data: enc.encode(settings) },
    { name: 'word/header1.xml', data: enc.encode(part('hdr', headerXml)) },
    { name: 'word/footer1.xml', data: enc.encode(part('ftr', footRight)) },
    { name: 'word/_rels/document.xml.rels', data: enc.encode(docRels) },
  ];
  if (logoB64) { const bin = atob(logoB64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); files.push({ name: 'word/media/logo.png', data: u }); }
  return writeZip(files);
}
