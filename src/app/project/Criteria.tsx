import React from 'react';
import { LuCheck, LuTriangleAlert, LuInfo, LuTarget } from 'react-icons/lu';
import type { Project } from '../../lib/types';
import { criterionCoverage } from '../../lib/derive';
import { SourceChip, Empty, SECTION_LABEL } from '../../components/ui';
import { openSource } from '../common';
import { navigate } from '../../lib/store';

const COV: Record<string, [string, string]> = { strong: ['ok', 'Fuerte'], partial: ['warn', 'Parcial'], weak: ['bad', 'Débil'], 'n/a': ['', 'Fórmula'] };
const GROUP_SHADE = ['var(--fg)', 'var(--accent)', '#84ADFF', '#C7D7FE', 'var(--border-strong)'];

export function Criteria({ p }: { p: Project }) {
  if (!p.criteria.length) {
    return <div className="card"><Empty icon={<LuTarget />} title="No se han encontrado criterios con puntuación" body="PROPO no ha encontrado criterios de adjudicación con puntos en los documentos. Revisa el anexo de criterios; si no está, pregunta al órgano de contratación." /></div>;
  }
  const total = p.criteria.reduce((a, c) => a + c.points, 0);
  const groups = [...new Set(p.criteria.map((c) => c.group))];
  const byGroup = groups.map((g) => ({ g, pts: p.criteria.filter((c) => c.group === g).reduce((a, c) => a + c.points, 0) }));
  const judgement = p.criteria.filter((c) => c.kind === 'judgement');
  const covered = judgement.filter((c) => criterionCoverage(p, c) === 'strong').reduce((a, c) => a + c.points, 0);
  return (
    <div className="stack gap-16">
      <div className="card card-pad">
        <div className="row-wrap" style={{ justifyContent: 'space-between' }}>
          <div><h3 style={{ fontSize: 17 }}>Criterios de adjudicación</h3><p className="small muted mt-4">{total} puntos en total · {judgement.reduce((a, c) => a + c.points, 0)} por juicio de valor · {p.criteria.filter((c) => c.kind === 'formula').reduce((a, c) => a + c.points, 0)} por fórmula</p></div>
          <div className="small"><strong className="num">{covered}</strong> <span className="muted">puntos de juicio de valor bien cubiertos</span></div>
        </div>
        <div className="crit-bar mt-16" role="img" aria-label="Puntos por grupo de criterios">
          {byGroup.map((b, i) => (
            <div key={b.g} style={{ width: `${(b.pts / total) * 100}%`, background: GROUP_SHADE[i % GROUP_SHADE.length], color: i < 2 ? '#fff' : 'var(--fg)' }} title={`${b.g}: ${b.pts} pts`}>{b.g} · {b.pts}</div>
          ))}
        </div>
        <div className="callout neutral small mt-16"><LuInfo /><div>PROPO mejora la alineación con los criterios de adjudicación publicados. No predice puntuaciones ni el resultado de la licitación.</div></div>
      </div>
      <div className="card">
        {groups.map((g) => (
          <React.Fragment key={g}>
            <div style={{ padding: '10px 20px', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }} className="row"><span className="eyebrow">{g}</span><span className="spacer" /><span className="xs subtle">{byGroup.find((b) => b.g === g)!.pts} pts</span></div>
            {p.criteria.filter((c) => c.group === g).map((c) => {
              const cov = criterionCoverage(p, c);
              const secs = p.sections.filter((s) => c.addressedBy.includes(s.id) || s.criteria.includes(c.id));
              return (
                <div key={c.id} className="crit-row">
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <p className="small muted mt-4">{c.description}</p>
                    <div className="mt-8"><SourceChip label={`${c.source.docName} — p. ${c.source.page}`} onClick={() => openSource({ project: p, docId: c.source.docId, page: c.source.page, quote: c.source.quote })} /></div>
                  </div>
                  <div className="pts num">{c.points}<span className="small muted" style={{ fontWeight: 400 }}> pts</span></div>
                  <div><span className={`badge ${COV[cov][0]}`}>{COV[cov][1]}</span><div className="xs subtle mt-4">{c.kind === 'formula' ? 'Se puntúa automáticamente' : 'Cobertura en la propuesta'}</div></div>
                  <div style={{ minWidth: 0 }}>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>Cómo lo cubre PROPO</div>
                    {c.kind === 'formula' ? (
                      <p className="small muted">Se valora por fórmula a partir de tu oferta económica. Los precios los fija y aprueba tu equipo; PROPO los mantiene fuera de la memoria técnica.</p>
                    ) : (
                      <>
                        {c.howAddressed.length > 0 && <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 4 }}>{c.howAddressed.map((h) => <li key={h} className="row small" style={{ alignItems: 'flex-start' }}><LuCheck style={{ width: 14, height: 14, marginTop: 3, color: 'var(--ok)', flex: 'none' }} />{h}</li>)}</ul>}
                        {c.gaps.length > 0 && <ul style={{ margin: '6px 0 0', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 4 }}>{c.gaps.map((h) => <li key={h} className="row small" style={{ alignItems: 'flex-start', color: 'var(--warn-ink)' }}><LuTriangleAlert style={{ width: 14, height: 14, marginTop: 3, flex: 'none' }} />{h}</li>)}</ul>}
                        {secs.length > 0 ? <div className="row-wrap mt-8">{secs.map((s) => <button key={s.id} className="btn btn-ghost btn-sm" style={{ paddingLeft: 6 }} onClick={() => navigate(`/app/projects/${p.id}/proposal`)}>{s.title} · <span className="muted">{SECTION_LABEL[s.status]}</span></button>)}</div> : <p className="small" style={{ color: 'var(--warn-ink)' }}>Todavía no hay ninguna sección que cubra este criterio.</p>}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
