// Memoria técnica en Word (.docx) para que el licitador la retoque en su editor.
// Un .docx es un ZIP con XML: se escribe a mano con el mismo `writeZip` del paquete, sin dependencias.
import type { AppState, Project } from './types';
import { writeZip } from './pipeline/zip';
import { fmtDate, nowIso, isUnknown } from './util';

const enc = new TextEncoder();
const esc = (s: string) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (content: string) => content.replace(/\s?\[S\d+\]/g, '').replace(/\[(?:Información requerida|Information required):\s*([^\]]+)\]/g, '[INFORMACIÓN REQUERIDA: $1]');

const run = (t: string, rpr = '') => `<w:r>${rpr ? `<w:rPr>${rpr}</w:rPr>` : ''}<w:t xml:space="preserve">${esc(t)}</w:t></w:r>`;
/** Párrafo con negritas de Markdown (**texto**). */
function para(text: string, style?: string, ppr = '') {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  const runs = parts.map((x) => (x.startsWith('**') && x.endsWith('**') ? run(x.slice(2, -2), '<w:b/>') : run(x))).join('');
  return `<w:p><w:pPr>${style ? `<w:pStyle w:val="${style}"/>` : ''}${ppr}</w:pPr>${runs}</w:p>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:lang w:val="es-ES"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="288" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="48"/><w:color w:val="0B1730"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60"/></w:pPr><w:rPr><w:sz w:val="24"/><w:color w:val="667085"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="30"/><w:color w:val="0B1730"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="0B1730"/></w:rPr></w:style>
</w:styles>`;

export function technicalProposalDocx(p: Project, s: AppState): Uint8Array {
  const body: string[] = [];
  body.push(para('Memoria técnica', 'Title'));
  body.push(para(p.name, 'Subtitle'));
  body.push(para(`${p.organization}${!isUnknown(p.analysis?.reference) ? ' · Exp. ' + p.analysis!.reference : ''}`, 'Subtitle'));
  body.push(para(`Presentada por ${s.company.legalName || '[nombre de la empresa]'} · ${fmtDate(nowIso())}`, 'Subtitle'));
  p.sections.forEach((sec, i) => {
    body.push(para(`${i + 1}. ${sec.title}${sec.status !== 'approved' ? '   [BORRADOR — sin aprobar]' : ''}`, 'Heading1'));
    if (!sec.content.trim()) { body.push(para('[Sección todavía sin redactar]')); return; }
    for (const line of plain(sec.content).split('\n')) {
      const l = line.trim();
      if (!l) continue;
      const h = l.match(/^#{1,6}\s+(.*)$/);
      if (h) body.push(para(h[1].replace(/\*\*/g, ''), 'Heading2'));
      else if (/^[-•*]\s+/.test(l)) body.push(para('•\t' + l.replace(/^[-•*]\s+/, ''), undefined, '<w:tabs><w:tab w:val="left" w:pos="360"/></w:tabs><w:ind w:left="360" w:hanging="360"/><w:spacing w:after="60"/>'));
      else body.push(para(l));
    }
  });
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  return writeZip([
    { name: '[Content_Types].xml', data: enc.encode(types) },
    { name: '_rels/.rels', data: enc.encode(rels) },
    { name: 'word/document.xml', data: enc.encode(doc) },
    { name: 'word/styles.xml', data: enc.encode(STYLES) },
    { name: 'word/_rels/document.xml.rels', data: enc.encode(docRels) },
  ]);
}
