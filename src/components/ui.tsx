import React, { useEffect, useRef, useState } from 'react';
import { LuX, LuCircleCheck, LuCircleAlert, LuCircleX, LuCircleDashed, LuFileText, LuBuilding2 } from 'react-icons/lu';
import { useToasts } from '../lib/store';
import type { SectionStatus, ReqStatus } from '../lib/types';

export function LogoMark({ size = 28 }: { size?: number }) {
  // Navy tile with a white "P"; the blue notch where bowl meets stem is the brand's accent.
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" style={{ width: size, height: size }}>
      <rect width="32" height="32" rx="8" fill="#0B1730" />
      <path fillRule="evenodd" fill="#FFFFFF" d="M9 7.5h8.2a6.3 6.3 0 0 1 0 12.6H13.6V25H9zM13.6 11.4v4.8h3.4a2.4 2.4 0 0 0 0-4.8z" />
      <path fill="#1463FF" d="M13.6 16.2h3.9l-3.9 3.9z" />
    </svg>
  );
}

export function Logo({ size = 28, word = true, onClick }: { size?: number; word?: boolean; onClick?: () => void }) {
  return (
    <a className="logo" onClick={onClick} role={onClick ? 'link' : undefined} style={{ cursor: onClick ? 'pointer' : undefined }} aria-label="PROPO, inicio">
      <LogoMark size={size} />
      {word && <span className="logo-word">PROPO</span>}
    </a>
  );
}

export function Ring({ value, size = 64, stroke = 6, tone = 'fg', label }: { value: number; size?: number; stroke?: number; tone?: 'fg' | 'accent' | 'ok' | 'warn'; label?: React.ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const color = tone === 'accent' ? 'var(--accent)' : tone === 'ok' ? 'var(--ok)' : tone === 'warn' ? 'var(--warn)' : 'var(--fg)';
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(100, value)) / 100)} style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div className="ring-label" style={{ fontSize: size * 0.26 }}>{label ?? `${Math.round(value)}%`}</div>
    </div>
  );
}

export function Bar({ value, tone }: { value: number; tone?: 'accent' | 'ok' | 'warn' }) {
  return <div className={`bar ${tone ?? ''}`}><span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function Modal({ title, sub, onClose, children, footer, wide }: { title: React.ReactNode; sub?: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div className="grow"><h2>{title}</h2>{sub && <p className="muted mt-4">{sub}</p>}</div>
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose} aria-label="Cerrar"><LuX /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Drawer({ title, onClose, children, actions, wide, footer }: { title: React.ReactNode; onClose: () => void; children: React.ReactNode; actions?: React.ReactNode; wide?: boolean; footer?: React.ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className={`drawer ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div className="grow" style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: 15 }}>{title}</div>
          {actions}
          <button className="btn btn-ghost btn-sm btn-icon" onClick={onClose} aria-label="Cerrar"><LuX /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </>
  );
}

export function Toasts() {
  const ts = useToasts();
  return <div className="toasts" aria-live="polite">{ts.map((t) => <div key={t.id} className={`toast ${t.tone}`}><span className="dot" />{t.text}</div>)}</div>;
}

export function Empty({ icon, title, body, action }: { icon: React.ReactNode; title: string; body?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <div className="empty-ico">{icon}</div>
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} />;
}

export function ReqIcon({ status }: { status: ReqStatus }) {
  if (status === 'fulfilled') return <LuCircleCheck className="state-ico ok" aria-label="Cumplido" />;
  if (status === 'needs_info') return <LuCircleAlert className="state-ico warn" aria-label="Información requerida" />;
  if (status === 'missing') return <LuCircleX className="state-ico bad" aria-label="Falta" />;
  return <LuCircleDashed className="state-ico muted" aria-label="Omitido" />;
}

export const REQ_LABEL: Record<ReqStatus, string> = { fulfilled: 'Cumplido', needs_info: 'Información requerida', missing: 'Falta', skipped: 'Omitido' };
export const REQ_TONE: Record<ReqStatus, string> = { fulfilled: 'ok', needs_info: 'warn', missing: 'bad', skipped: '' };

export const SECTION_LABEL: Record<SectionStatus, string> = { not_started: 'Sin empezar', generating: 'Generando…', draft: 'Borrador', ai_generated: 'Generada por IA', reviewed: 'Revisada', approved: 'Aprobada', rejected: 'Rechazada' };
export const SECTION_TONE: Record<SectionStatus, string> = { not_started: '', generating: 'accent', draft: '', ai_generated: 'accent', reviewed: 'warn', approved: 'ok', rejected: 'bad' };

export function SourceChip({ label, onClick, company }: { label: string; onClick?: () => void; company?: boolean }) {
  return (
    <button type="button" className="source-chip" onClick={onClick} title={label}>
      {company ? <LuBuilding2 /> : <LuFileText />}<span>{label}</span>
    </button>
  );
}

export function Menu({ trigger, children, align = 'right' }: { trigger: (open: boolean, toggle: () => void) => React.ReactNode; children: (close: () => void) => React.ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {trigger(open, () => setOpen((o) => !o))}
      {open && <div className="menu" style={align === 'left' ? { left: 0, right: 'auto' } : undefined}>{children(() => setOpen(false))}</div>}
    </div>
  );
}

/** Renders generated text: paragraphs, "- " bullets, [S1] citation chips, [Information required: …] highlights. */
export function RichText({ text, onCite, citeKinds, onInfo }: { text: string; onCite?: (marker: string) => void; citeKinds?: Record<string, 'tender' | 'company'>; onInfo?: (tag: string, label: string) => void }) {
  const blocks = text.split(/\n{2,}/);
  const inline = (s: string, key: string) => {
    const parts = s.split(/(\[S\d+\]|\[(?:Información requerida|Information required):[^\]]*\]|\*\*[^*]+\*\*)/g);
    return parts.map((p, i) => {
      const m = p.match(/^\[(S\d+)\]$/);
      if (m) return <button key={key + i} type="button" className={`cite ${citeKinds?.[m[1]] === 'company' ? 'company' : ''}`} onClick={() => onCite?.(m[1])} title="Ver fuente">{m[1]}</button>;
      if (p.startsWith('[Información requerida:') || p.startsWith('[Information required:')) {
        const label = p.slice(p.indexOf(':') + 1, -1).trim();
        return onInfo
          ? <button key={key + i} type="button" className="info-req info-req-btn" title="Añadir este dato" onClick={() => onInfo(p, label)}>{p.slice(1, -1)}<span className="info-req-add">Añadir</span></button>
          : <span key={key + i} className="info-req">{p.slice(1, -1)}</span>;
      }
      if (p.startsWith('**')) return <strong key={key + i}>{p.slice(2, -2)}</strong>;
      return <React.Fragment key={key + i}>{p}</React.Fragment>;
    });
  };
  return (
    <>
      {blocks.map((b, bi) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-•*]\s+/.test(l) || !l.trim())) {
          return <ul key={bi}>{lines.filter((l) => l.trim()).map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-•*]\s+/, ''), `${bi}-${li}-`)}</li>)}</ul>;
        }
        const head = lines.findIndex((l) => /^\s*[-•*]\s+/.test(l));
        if (head > 0) {
          return (
            <React.Fragment key={bi}>
              <p>{inline(lines.slice(0, head).join(' '), `${bi}p`)}</p>
              <ul>{lines.slice(head).filter((l) => l.trim()).map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-•*]\s+/, ''), `${bi}-${li}-`)}</li>)}</ul>
            </React.Fragment>
          );
        }
        return <p key={bi}>{inline(lines.join(' '), `${bi}`)}</p>;
      })}
    </>
  );
}

export function SampleBadge() { return <span className="badge sample" title="Datos ficticios para explorar PROPO">Ejemplo</span>; }
