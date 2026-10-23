// Empresa → «Tu sector»: datos propios del sector de la empresa (y, en construcción, la clasificación y la maquinaria).
// Solo aparecen los sectores de la empresa; los datos se guardan al momento en company.sectorData.
import React from 'react';
import { LuPlus, LuTrash2, LuCheck } from 'react-icons/lu';
import { useStore, update, navigate } from '../lib/store';
import { Toggle } from '../components/ui';
import { companySectors, profileFor, SOCIAL, COMMON, type SField } from '../lib/sectorProfiles';
import { ObraTab } from './CompanyObra';

export function SectorTab({ pick }: { pick?: string }) {
  const c = useStore((s) => s.company);
  const ids = companySectors(c);
  if (!ids.length) return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 18 }}>Dinos a qué se dedica tu empresa</h3>
      <p className="small muted mt-4">Elige tus sectores en el perfil de búsqueda y aquí aparecerán los datos que más puntúan en los pliegos de tu sector: medios, capacidad, habilitaciones y compromisos.</p>
      <button className="btn btn-primary mt-12" onClick={() => navigate('/app/company/search')}>Elegir mis sectores</button>
    </div>
  );
  const cur = pick && ids.includes(pick) ? pick : ids[0];
  const p = profileFor(cur);
  return (
    <div className="stack gap-16">
      {ids.length > 1 && <div className="row-wrap">{ids.map((id) => <button key={id} type="button" className={`chip ${id === cur ? 'on' : ''}`} onClick={() => navigate(`/app/company/sector/${id}`)}>{id === cur && <LuCheck />}{profileFor(id).label}</button>)}</div>}
      <div className="card card-pad">
        <div className="eyebrow">Tu sector</div>
        <h3 className="mt-4" style={{ fontSize: 20 }}>{p.label}</h3>
        <p className="small muted mt-4">{p.intro} Rellena lo que tengas: PROPO lo usa para cumplir requisitos y para que la memoria hable de tus medios reales. Se guarda solo.</p>
      </div>
      {cur === 'construccion' && <ObraTab />}
      {p.groups.map((g) => <Group key={g.title} title={g.title} fields={g.fields} sector={cur} />)}
      <Group title={SOCIAL.title} fields={SOCIAL.fields} sector={COMMON} note="Común a todos tus sectores." />
    </div>
  );
}

function Group({ title, fields, sector, note }: { title: string; fields: SField[]; sector: string; note?: string }) {
  const data = useStore((s) => s.company.sectorData?.[sector] ?? {});
  const set = (id: string, v: any) => update((s) => { const all = (s.company.sectorData ??= {}); (all[sector] ??= {})[id] = v; });
  return (
    <div className="card">
      <div className="card-head"><h3>{title}</h3>{note && <><span className="spacer" /><span className="xs subtle">{note}</span></>}</div>
      <div className="card-body stack">
        {fields.map((f) => <Field key={f.id} f={f} v={data[f.id]} set={(v) => set(f.id, v)} />)}
      </div>
    </div>
  );
}

function Field({ f, v, set }: { f: SField; v: any; set: (v: any) => void }) {
  const id = `sf-${f.id}`;
  const help = f.help && <span className="hint">{f.help}</span>;
  if (f.type === 'yesno') return (
    <div className="entity"><div><div style={{ fontWeight: 500 }}>{f.label}</div>{f.help && <div className="small muted">{f.help}</div>}</div><Toggle on={!!v} onChange={set} label={f.label} /></div>
  );
  if (f.type === 'chips') {
    const on: string[] = Array.isArray(v) ? v : [];
    return (
      <div className="field"><span className="label">{f.label}</span>
        <div className="row-wrap">{f.options!.map((o) => <button key={o} type="button" className={`chip ${on.includes(o) ? 'on' : ''}`} onClick={() => set(on.includes(o) ? on.filter((x) => x !== o) : [...on, o])}>{on.includes(o) && <LuCheck />}{o}</button>)}</div>{help}</div>
    );
  }
  if (f.type === 'list') {
    const rows: Record<string, string>[] = Array.isArray(v) && v.length ? v : [{}];
    const edit = (i: number, col: string, val: string) => set(rows.map((r, k) => (k === i ? { ...r, [col]: val } : r)));
    return (
      <div className="field"><span className="label">{f.label}</span>
        <div className="stack" style={{ gap: 8 }}>
          {rows.map((r, i) => (
            <div key={i} className="row" style={{ gap: 8 }}>
              {f.columns!.map((col) => <input key={col.id} className="input" style={{ flex: col.width ?? 1, minWidth: 0 }} aria-label={col.label} placeholder={col.label} inputMode={col.numeric ? 'numeric' : undefined} value={r[col.id] ?? ''} onChange={(e) => edit(i, col.id, col.numeric ? e.target.value.replace(/[^\d]/g, '') : e.target.value)} />)}
              <button type="button" className="btn btn-ghost btn-sm btn-icon" aria-label="Quitar fila" onClick={() => set(rows.filter((_, k) => k !== i))}><LuTrash2 /></button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => set([...rows, {}])}><LuPlus /> Añadir fila</button>
        </div>{help}</div>
    );
  }
  if (f.type === 'textarea') return <div className="field"><label htmlFor={id}>{f.label}</label><textarea id={id} className="textarea" rows={3} placeholder={f.placeholder} value={v ?? ''} onChange={(e) => set(e.target.value)} />{help}</div>;
  return (
    <div className="field"><label htmlFor={id}>{f.label}</label>
      <div className="row" style={{ gap: 8 }}><input id={id} className="input" style={{ maxWidth: f.type === 'number' ? 160 : undefined }} inputMode={f.type === 'number' ? 'decimal' : undefined} placeholder={f.placeholder} value={v ?? ''} onChange={(e) => set(f.type === 'number' ? e.target.value.replace(/[^\d.,]/g, '') : e.target.value)} />{f.unit && <span className="small muted">{f.unit}</span>}</div>{help}</div>
  );
}
