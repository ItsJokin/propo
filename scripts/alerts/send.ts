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

function mail(name: string, groups: { a: TenderAlert; hits: TedNotice[] }[]) {
  const n = groups.reduce((s, g) => s + g.hits.length, 0);
  const subject = `${n} licitación${n === 1 ? '' : 'es'} nueva${n === 1 ? '' : 's'} para tus alertas`;
  const link = (t: TedNotice) => t.live?.url || `${SITE}/#/app/tenders`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:620px;color:#1c2430">
<div style="background:#0B1730;padding:20px 24px;color:#ffffff;font-weight:800;font-size:20px;letter-spacing:1px;border-radius:10px 10px 0 0">PROPO</div>
<p>Hola${name ? ` ${esc(name)}` : ''},</p><p>Ayer se publicaron <strong>${n}</strong> licitaciones que cumplen tus alertas de PROPO:</p>
${groups.map((g) => `<h3 style="font-size:15px;margin:22px 0 6px">${esc(g.a.name)}</h3>${g.hits.slice(0, 10).map((t) => `<p style="margin:0 0 12px"><a href="${esc(link(t))}" style="color:#1463FF;font-weight:bold;text-decoration:none">${esc(t.title)}</a><br><span style="font-size:13px;color:#5b6573">${esc(t.buyer)}${t.value ? ` · ${eur(t.value)}` : ''}${t.deadline ? ` · plazo ${date(t.deadline)}` : ''}</span></p>`).join('')}${g.hits.length > 10 ? `<p style="font-size:13px">Y ${g.hits.length - 10} más en PROPO.</p>` : ''}`).join('')}
<p style="margin-top:24px"><a href="${SITE}/#/app/tenders" style="display:inline-block;background:#1463FF;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 26px;border-radius:10px">Verlas en PROPO</a></p>
<p style="font-size:12px;color:#8a93a0;margin-top:28px">Recibes este correo porque tienes alertas en PROPO. Puedes desactivarlo en Ajustes → Avisos por correo, o borrar tus alertas.</p></div>`;
  const text = `Ayer se publicaron ${n} licitaciones que cumplen tus alertas de PROPO:\n\n${groups.map((g) => `${g.a.name}\n${g.hits.slice(0, 10).map((t) => `- ${t.title} (${t.buyer}) ${link(t)}`).join('\n')}`).join('\n\n')}\n\nVerlas en PROPO: ${SITE}/#/app/tenders\nPuedes desactivar estos correos en Ajustes → Avisos por correo.`;
  return { subject, html, text };
}

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
