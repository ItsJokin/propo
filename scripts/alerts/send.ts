// Correo diario de alertas: a cada cuenta con alertas y con «Avisos por correo» activado le manda las licitaciones
// publicadas ayer que cumplen sus alertas. Lo ejecuta .github/workflows/alerts.yml cada mañana.
// Variables: SITE, SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY, MAIL_FROM (opcional), DRY=1 (no envía, solo cuenta).
import { toNotice } from '../../src/lib/data/live';
import { alertHits } from '../../src/lib/alerts';
import type { TenderAlert } from '../../src/lib/types';
import type { TedNotice } from '../../src/lib/discovery/tedSnapshot';

const env = process.env;
const SITE = (env.SITE || 'https://propo.es').replace(/\/+$/, '');
const DRY = env.DRY === '1';
const day = env.DAY || new Date(Date.now() - 864e5).toISOString().slice(0, 10);   // ayer (UTC)

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const eur = (n: number | null) => (n ? n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : '');
const date = (d: string) => (d ? d.slice(0, 10).split('-').reverse().join('/') : '');

async function workspaces(): Promise<{ user_id: string; data: any }[]> {
  const out: { user_id: string; data: any }[] = [];
  for (let off = 0; ; off += 500) {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/workspaces?select=user_id,data&order=user_id&limit=500&offset=${off}`, { headers: { apikey: env.SUPABASE_SECRET_KEY!, Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}` } });
    if (!r.ok) throw new Error(`workspaces: HTTP ${r.status}`);
    const rows = await r.json(); out.push(...rows); if (rows.length < 500) return out;
  }
}

const LONG_DATE = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' });
const left = (d: string) => { if (!d) return null; const n = Math.ceil((new Date(d.length > 10 ? d : `${d}T23:59:00`).getTime() - Date.now()) / 864e5); return n >= 0 ? n : null; };
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
const SMALL = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'en', 'a', 'al', 'por', 'para', 'con', 'sin', 'un', 'una']);
/** Títulos en mayúsculas o «Con Cada Palabra En Mayúscula» → escritura normal (las siglas se respetan). */
function tidy(t: string, hint = '') {
  // Nombres propios que ya vienen bien escritos en el organismo o el lugar (Fuerteventura, Jaén, Aena…).
  const flat = (w: string) => w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const proper = new Map(hint.split(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]+/).filter((w) => /^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]{2,}$/.test(w)).map((w) => [flat(w), w] as [string, string]));
  const words = t.split(/\s+/).filter((w) => /[a-záéíóúñü]/i.test(w));
  const upper = words.filter((w) => w === w.toUpperCase()).length / (words.length || 1);
  const title = words.filter((w) => /^[A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]/.test(w)).length / (words.length || 1);
  if (upper < 0.7 && title < 0.6) return t;
  const low = t.split(/(\s+)/).map((w) => { const m = /^([^A-Za-zÁÉÍÓÚÑÜáéíóúñü]*)(.*?)([^A-Za-zÁÉÍÓÚÑÜáéíóúñü]*)$/.exec(w)!; const pr = proper.get(flat(m[2])); return pr ? m[1] + pr + m[3] : /^[A-ZÁÉÍÓÚÑÜ0-9.\-/]{2,6}$/.test(w) && upper < 0.7 && !SMALL.has(w.toLowerCase()) ? w : w.toLowerCase(); }).join('');
  return cap(low.trim());
}
const place = (t: TedNotice) => (t.city && t.city !== 'No consta' ? t.city : '');

/** Una licitación: tarjeta con objeto, organismo, lugar, importe, plazo y dos botones. */
function card(t: TedNotice) {
  const d = left(t.deadline); const urgent = d != null && d <= 7;
  const open = `${SITE}/#/app/tenders/${encodeURIComponent(t.id)}`;
  const meta = [
    ['Organismo', esc(t.buyer)],
    ...(place(t) ? [['Lugar', esc(place(t))]] : []),
    ...(t.value ? [['Importe', `<b style="color:#0B1730">${eur(t.value)}</b> <span style="color:#98A2B3">sin IVA</span>`]] : []),
    ...(t.deadline ? [['Plazo', `${date(t.deadline)}${d != null ? ` · <b style="color:${urgent ? '#B54708' : '#0B1730'}">${d === 0 ? 'cierra hoy' : `quedan ${d} día${d === 1 ? '' : 's'}`}</b>` : ''}`]] : []),
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E4E7EC;border-radius:12px;margin:0 0 14px 0"><tr><td style="padding:18px 20px">
<div style="font-size:11px;font-weight:800;letter-spacing:1.2px;color:#1463FF;text-transform:uppercase">${esc(t.kind || 'Contrato público')}</div>
<a href="${open}" style="display:block;margin-top:6px;font-size:16px;font-weight:700;line-height:1.4;color:#0B1730;text-decoration:none">${esc(tidy(t.title, `${t.buyer} ${t.city}`))}</a>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px">${meta.map(([k, v]) => `<tr><td style="padding:2px 14px 2px 0;font-size:13px;color:#98A2B3;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:2px 0;font-size:13px;color:#475467;line-height:1.5">${v}</td></tr>`).join('')}</table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px"><tr>
<td><a href="${open}" style="display:inline-block;background:#1463FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:13px;padding:10px 16px;border-radius:8px">Ver en PROPO →</a></td>
${t.live?.url ? `<td style="padding-left:14px"><a href="${esc(t.live.url)}" style="font-size:13px;color:#475467;text-decoration:underline">Ficha oficial</a></td>` : ''}
</tr></table></td></tr></table>`;
}

function mail(name: string, groups: { a: TenderAlert; hits: TedNotice[] }[]) {
  const n = groups.reduce((s, g) => s + g.hits.length, 0);
  const subject = n === 1 ? `1 licitación nueva para ti: ${tidy(groups[0].hits[0].title, `${groups[0].hits[0].buyer} ${groups[0].hits[0].city}`).slice(0, 60)}${groups[0].hits[0].title.length > 60 ? '…' : ''}` : `${n} licitaciones nuevas para tus alertas`;
  const first = esc(name);
  const html = `<!doctype html><html lang="es"><body style="margin:0;padding:0;background:#F4F6FA;font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif">
<div style="display:none;max-height:0;overflow:hidden">${esc(tidy(groups[0].hits[0].title, `${groups[0].hits[0].buyer} ${groups[0].hits[0].city}`))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6FA;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#0B1730;padding:22px 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td><img src="${SITE}/media/propo-logo-email.png" alt="" width="32" height="32" style="display:block;width:32px;height:32px"></td><td style="padding-left:10px;color:#ffffff;font-weight:800;font-size:19px;letter-spacing:1px">PROPO</td></tr></table></td>
<td align="right" style="vertical-align:middle;color:#8EA3C9;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Tus alertas</td></tr></table></td></tr>
<tr><td style="padding:30px 32px 8px 32px">
<div style="font-size:13px;color:#98A2B3">${cap(LONG_DATE(new Date().toISOString().slice(0, 10)))}</div>
<div style="font-size:25px;font-weight:800;color:#0B1730;letter-spacing:-0.5px;line-height:1.25;margin-top:6px">Buenos días${first ? `, ${first}` : ''}. Hay ${n === 1 ? '1 licitación nueva' : `${n} licitaciones nuevas`} para ti.</div>
<p style="color:#475467;font-size:15px;line-height:1.6;margin:12px 0 0 0">Se ${n === 1 ? 'publicó' : 'publicaron'} ayer y ${n === 1 ? 'encaja' : 'encajan'} con lo que buscas. Ábrela${n === 1 ? '' : 's'} en PROPO y te decimos si merece la pena presentarse y qué te piden.</p>
</td></tr>
${groups.map((g) => `<tr><td style="padding:22px 32px 4px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px"><tr><td style="font-size:12px;font-weight:800;letter-spacing:1.2px;color:#0B1730;text-transform:uppercase">🔔 ${esc(g.a.name)}</td><td align="right" style="font-size:12px;color:#98A2B3">${g.hits.length} nueva${g.hits.length === 1 ? '' : 's'}</td></tr></table>
${g.hits.slice(0, 10).map(card).join('')}
${g.hits.length > 10 ? `<p style="font-size:13px;color:#475467;margin:4px 0 0 0">Y ${g.hits.length - 10} más en PROPO.</p>` : ''}
</td></tr>`).join('')}
<tr><td style="padding:14px 32px 30px 32px"><a href="${SITE}/#/app/tenders" style="display:inline-block;background:#0B1730;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 24px;border-radius:10px">Ver todas en PROPO</a></td></tr>
<tr><td style="padding:0 32px 28px 32px;border-top:1px solid #E4E7EC"><p style="color:#98A2B3;font-size:12px;line-height:1.6;margin:18px 0 0 0">Recibes este correo porque tienes alertas de licitaciones en PROPO. Puedes cambiarlas o borrarlas en <b>Licitaciones → Tus alertas</b>, o dejar de recibir correos en <b>Ajustes → Avisos por correo</b>.</p></td></tr>
</table>
<div style="color:#98A2B3;font-size:12px;margin-top:16px">PROPO · Licitaciones públicas, preparadas en minutos · <a href="${SITE}" style="color:#98A2B3">propo.es</a></div>
</td></tr></table></body></html>`;
  const text = `Buenos días${name ? `, ${name}` : ''}. Hay ${n} licitación${n === 1 ? '' : 'es'} nueva${n === 1 ? '' : 's'} para tus alertas de PROPO:\n\n${groups.map((g) => `${g.a.name}\n${g.hits.slice(0, 10).map((t) => `- ${t.title}\n  ${t.buyer}${t.value ? ` · ${eur(t.value)}` : ''}${t.deadline ? ` · plazo ${date(t.deadline)}` : ''}\n  ${SITE}/#/app/tenders/${encodeURIComponent(t.id)}`).join('\n')}`).join('\n\n')}\n\nVer todas: ${SITE}/#/app/tenders\nPuedes dejar de recibir estos correos en Ajustes → Avisos por correo.`;
  return { subject, html, text };
}

/** Vista previa para revisar el diseño sin enviar nada: PREVIEW=archivo.html */
export const previewMail = mail;

async function main() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || (!DRY && !env.RESEND_API_KEY)) { console.log('::warning::Faltan secretos (SUPABASE_URL, SUPABASE_SECRET_KEY, RESEND_API_KEY): no se mandan alertas.'); return; }
  const r = await fetch(`${SITE}/data/tenders.json`); if (!r.ok) throw new Error(`tenders.json: HTTP ${r.status}`);
  const rows: { t: TedNotice }[] = ((await r.json()).rows as any[][]).map((x) => ({ t: toNotice(x) })).filter(({ t }) => t.pub === day);
  console.log(`${rows.length} licitaciones publicadas el ${day}`);
  let sent = 0, users = 0;
  for (const w of await workspaces()) {
    const d = w.data ?? {}; const alerts: TenderAlert[] = Array.isArray(d.alerts) ? d.alerts : [];
    const to = d.user?.email; if (!alerts.length || !to || d.settings?.emailNotifications === false || d.demo) continue;
    users++;
    const groups = alerts.map((a) => ({ a, hits: alertHits(a, rows, d.company).map((x) => x.t) })).filter((g) => g.hits.length);
    if (!groups.length) continue;
    const m = mail(String(d.user?.name || '').split(' ')[0], groups);
    if (DRY) { console.log(`(prueba) ${w.user_id}: ${m.subject}`); sent++; continue; }
    const s = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `alerts-${w.user_id}-${day}` },
      body: JSON.stringify({ from: env.MAIL_FROM || 'PROPO <hola@propo.es>', to: [to], reply_to: 'hola@propo.es', subject: m.subject, html: m.html, text: m.text }),
    });
    if (s.ok) sent++; else console.log(`::warning::No se ha podido enviar a ${w.user_id}: HTTP ${s.status}`);
  }
  console.log(`${users} cuentas con alertas · ${sent} correos ${DRY ? 'preparados (prueba)' : 'enviados'}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
