// Empresa → Construcción: clasificación de contratista, registros (ROLECE, RERA) y maquinaria propia.
// Con esto PROPO comprueba al instante si la empresa puede presentarse a una obra y lo usa al redactar la memoria.
import React, { useState } from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import { useStore, update, navigate } from '../lib/store';
import { uid } from '../lib/util';
import { Toggle } from '../components/ui';

const GRUPOS: [string, string][] = [
  ['A', 'Movimiento de tierras y perforaciones'], ['B', 'Puentes, viaductos y grandes estructuras'], ['C', 'Edificaciones'], ['D', 'Ferrocarriles'],
  ['E', 'Hidráulicas'], ['F', 'Marítimas'], ['G', 'Viales y pistas'], ['H', 'Transportes de productos petrolíferos y gaseosos'],
  ['I', 'Instalaciones eléctricas'], ['J', 'Instalaciones mecánicas'], ['K', 'Especiales'],
];

export function ObraTab() {
  const c = useStore((s) => s.company);
  const cl = c.clasificaciones ?? [];
  const mq = c.maquinaria ?? [];
  const [n, setN] = useState({ grupo: 'C', subgrupo: '', categoria: '' });
  const [m, setM] = useState({ nombre: '', cantidad: '1', propia: true });
  return (
    <div className="stack gap-16">
      <div className="card">
        <div className="card-head"><h3>Clasificación de contratista</h3></div>
        <div className="card-body stack">
          <p className="small muted">La clasificación (grupo, subgrupo y categoría) es obligatoria en muchas obras de más de 500.000 € y sirve como solvencia en las demás. Con ella, PROPO te dice en cada obra si puedes presentarte.</p>
          {cl.length === 0 && <p className="small subtle">Todavía no has añadido ninguna clasificación.</p>}
          {cl.map((x, i) => (
            <div key={i} className="entity"><div><strong>Grupo {x.grupo}</strong> · subgrupo {x.subgrupo || '—'} · categoría {x.categoria || '—'}<div className="small muted">{GRUPOS.find((g) => g[0] === x.grupo)?.[1]}</div></div>
              <button className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar" onClick={() => update((s) => { s.company.clasificaciones = (s.company.clasificaciones ?? []).filter((_, k) => k !== i); })}><LuTrash2 /></button></div>
          ))}
          <div className="row-wrap" style={{ gap: 8, alignItems: 'flex-end' }}>
            <div className="field" style={{ minWidth: 220 }}><label htmlFor="cl-g">Grupo</label><select id="cl-g" className="select" value={n.grupo} onChange={(e) => setN({ ...n, grupo: e.target.value })}>{GRUPOS.map(([g, l]) => <option key={g} value={g}>{g} · {l}</option>)}</select></div>
            <div className="field" style={{ width: 110 }}><label htmlFor="cl-s">Subgrupo</label><input id="cl-s" className="input" inputMode="numeric" value={n.subgrupo} onChange={(e) => setN({ ...n, subgrupo: e.target.value.replace(/\D/g, '') })} placeholder="p. ej. 7" /></div>
            <div className="field" style={{ width: 110 }}><label htmlFor="cl-c">Categoría</label><select id="cl-c" className="select" value={n.categoria} onChange={(e) => setN({ ...n, categoria: e.target.value })}><option value="">—</option>{['1', '2', '3', '4', '5', '6'].map((x) => <option key={x}>{x}</option>)}</select></div>
            <button className="btn btn-secondary" disabled={!n.subgrupo || !n.categoria} onClick={() => { update((s) => { s.company.clasificaciones = [...(s.company.clasificaciones ?? []), { ...n }]; }); setN({ ...n, subgrupo: '', categoria: '' }); }}><LuPlus /> Añadir</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Registros</h3></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Inscrita en el ROLECE</div><div className="small muted">Registro Oficial de Licitadores y Empresas Clasificadas (o el registro de tu comunidad). Lo exigen casi todos los procedimientos simplificados.</div></div>
          <Toggle on={!!c.rolece} onChange={(v) => update((s) => { s.company.rolece = v; })} label="ROLECE" /></div>
        <div className="entity"><div><div style={{ fontWeight: 500 }}>Inscrita en el RERA</div><div className="small muted">Registro de Empresas con Riesgo de Amianto. Obligatorio en obras con retirada de amianto (cubiertas de fibrocemento, por ejemplo).</div></div>
          <Toggle on={!!c.rera} onChange={(v) => update((s) => { s.company.rera = v; })} label="RERA" /></div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Maquinaria y medios</h3></div>
        <div className="card-body stack">
          <p className="small muted">La maquinaria que puedes adscribir a una obra. PROPO la usa al redactar la memoria y el plan de obra, y nunca pone como tuya una máquina que no esté aquí.</p>
          {mq.map((x) => (
            <div key={x.id} className="entity"><div><strong>{x.cantidad} × {x.nombre}</strong><div className="small muted">{x.propia ? 'En propiedad' : 'Alquilada o disponible por contrato'}</div></div>
              <button className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar" onClick={() => update((s) => { s.company.maquinaria = (s.company.maquinaria ?? []).filter((y) => y.id !== x.id); })}><LuTrash2 /></button></div>
          ))}
          <div className="row-wrap" style={{ gap: 8, alignItems: 'flex-end' }}>
            <div className="field" style={{ flex: 1, minWidth: 220 }}><label htmlFor="mq-n">Máquina o medio</label><input id="mq-n" className="input" value={m.nombre} onChange={(e) => setM({ ...m, nombre: e.target.value })} placeholder="p. ej. Retroexcavadora mixta, plataforma elevadora de 16 m" /></div>
            <div className="field" style={{ width: 100 }}><label htmlFor="mq-c">Unidades</label><input id="mq-c" className="input" inputMode="numeric" value={m.cantidad} onChange={(e) => setM({ ...m, cantidad: e.target.value.replace(/\D/g, '') })} /></div>
            <label className="choice" style={{ marginBottom: 10 }}><input type="checkbox" checked={m.propia} onChange={(e) => setM({ ...m, propia: e.target.checked })} /> En propiedad</label>
            <button className="btn btn-secondary" disabled={!m.nombre.trim()} onClick={() => { update((s) => { s.company.maquinaria = [...(s.company.maquinaria ?? []), { id: uid('mq'), nombre: m.nombre.trim(), cantidad: Number(m.cantidad) || 1, propia: m.propia }]; }); setM({ nombre: '', cantidad: '1', propia: true }); }}><LuPlus /> Añadir</button>
          </div>
          <p className="xs subtle">El jefe de obra y los encargados se añaden en <a style={{ cursor: 'pointer' }} onClick={() => navigate('/app/company/team')}>Equipo</a>, con sus años de experiencia.</p>
        </div>
      </div>
    </div>
  );
}
