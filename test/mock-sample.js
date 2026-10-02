(() => {
  const sample = async (input, opts) => {
    const text = Array.isArray(input) ? input[input.length - 1].content : input;
    const m = [...text.matchAll(/\[(S\d+)\] \(tender\)/g)].map(x => x[1]);
    const out = `Los principales riesgos de exclusión son incluir información de precio en el sobre B [${m[0] || 'S1'}] y superar el presupuesto máximo [${m[1] || 'S2'}].\n\n- Comprueba el límite de páginas\n- Firma todos los sobres`;
    console.log('[mock] chat call');
    await new Promise(r => setTimeout(r, 300));
    opts?.onText?.({ text: out, delta: out });
    return { text: out, truncated: false, modelTierApplied: 'default' };
  };
  sample.json = async (prompt) => {
    await new Promise(r => setTimeout(r, 400));
    if (prompt.includes('tender analysis engine')) {
      console.log('[mock] extraction call, prompt chars', prompt.length);
      const blocks = [...prompt.matchAll(/<<<DOC "([^"]+)" \| PAGE (\d+)>>>\n([\s\S]*?)(?=\n\n<<<DOC|$)/g)];
      const reqs = [];
      for (const b of blocks) {
        const sents = b[3].replace(/\n/g, ' ').split(/(?<=\.)\s+/).filter(x => /deber[áa]n?\s/i.test(x));
        for (const q of sents) reqs.push({ title: q.split(' ').slice(1, 7).join(' '), category: /ISO/.test(q) ? 'certification' : /seguro|volumen/.test(q) ? 'financial' : 'technical', quote: q.replace(/^\d+\.\d+\s*/, '').slice(0, 200), doc: b[1], page: +b[2], clause: null, mandatory: true, critical: /ISO|seguro/.test(q), match: { status: /ISO 9001/.test(q) ? 'fulfilled' : 'needs_info', evidence_ids: /ISO 9001/.test(q) ? ['c_fake', 'pp_nonexistent'] : [], ask: '¿Pregunta simulada?' } });
      }
      reqs.push({ title: 'Requisito inventado', category: 'legal', quote: 'El licitador deberá disponer de una nave espacial matriculada en Andorra.', doc: blocks[0][1], page: 1, mandatory: true, critical: true, match: { status: 'fulfilled', evidence_ids: [], ask: null } });
      return { summary: 'Mock AI summary of the tender.', authority: 'Garraf Coast Town Council (fictional)', reference: 'GCT-SERV-2026-031', cpv: '90911200-8', budget: '€1,480,000', duration: '3 years + 1', submission_deadline: '2026-10-25', deadlines: [{ label: 'Submission deadline', date: '2026-10-25', doc: blocks[0][1], page: 1 }], page_limit: '30 pages, Arial 11', requirements: reqs, criteria: [{ group: 'Price', name: 'Economic offer', points: 45, kind: 'formula', description: 'Economic offer: up to 45 points', doc: blocks[0][1], page: 5 }, { group: 'Quality', name: 'Service organisation and work plan', points: 25, kind: 'judgement', description: 'Service organisation and work plan: up to 25 points.', doc: blocks[0][1], page: 5 }], required_documents: ['ESPD', 'Insurance'], exclusion_risks: [{ text: 'Price in envelope B', doc: blocks[0][1], page: 6 }], proposal_structure: [{ title: 'Executive summary', guidance: 'Summary', criteria: [] }, { title: 'Service organisation and work plan', guidance: 'Scored 25 pts', criteria: ['Service organisation and work plan'] }] };
    }
    if (prompt.includes('drafting one section')) {
      console.log('[mock] section call');
      return { content: 'We will organise the service with a dedicated coordinator [S1]. Our team has [Information required: number of staff] people [S99].\n\n- Daily cleaning [S2]\n- Weekly deep cleaning', missing: ['number of staff'], confidence: 0.83 };
    }
    return {};
  };
  window.claude = { use: async (n) => n === 'sample' ? sample : null };
})();
