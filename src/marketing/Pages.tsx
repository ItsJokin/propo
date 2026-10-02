import React, { useState } from 'react';
import { LuLock, LuShieldCheck, LuServer, LuKeyRound, LuHistory, LuTrash2, LuUsers, LuDatabase, LuCheck, LuArrowRight, LuCopy, LuBookOpen } from 'react-icons/lu';
import { MkLayout, startDemo } from './Layout';
import { navigate, toast } from '../lib/store';
import { Faq } from './Landing';

function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub: string }) {
  return (
    <section className="section" style={{ paddingBottom: 32 }}>
      <div className="mk-wrap section-head" style={{ marginBottom: 0, maxWidth: 760 }}>
        <div className="eyebrow">{eyebrow}</div>
        <h2 style={{ fontSize: 'clamp(36px, 4.6vw, 56px)' }}>{title}</h2>
        <p>{sub}</p>
      </div>
    </section>
  );
}

export function Features() {
  const groups: [string, string, string[]][] = [
    ['Buscador de licitaciones', 'Licitaciones públicas que encajan con tu empresa, puntuadas y explicadas.', ['Anuncios oficiales de TED y, en producción, de la Plataforma de Contratación del Sector Público', 'Compatibilidad por sector (CPV), región, importe y plazo', 'Alertas por sector y región', 'De la licitación a la propuesta en un clic']],
    ['Subida y análisis', 'Sube el pliego completo. PROPO lee PDF, Word, Excel y ZIP y construye una vista estructurada de la oportunidad.', ['Resumen del objeto, alcance, duración y criterios de adjudicación', 'Plazos, incluidos los de preguntas y apertura', 'Criterios con puntos y fórmulas', 'Riesgos de exclusión destacados', 'Archivos escaneados o ilegibles marcados, nunca omitidos en silencio']],
    ['Motor de requisitos', 'Cada requisito se convierte en una tarea con estado, página de origen y la prueba que lo cumple.', ['Cumplido, información requerida o falta', 'Cruzado con tus documentos, proyectos, certificaciones y equipo', 'Preguntas concretas cuando falta una prueba', '«Extracción dudosa» cuando una cita no se puede verificar en su página']],
    ['Memoria de empresa', 'Tu perfil y tu biblioteca de documentos hacen que cada propuesta cueste menos que la anterior.', ['Documentos legales, financieros y corporativos con fecha de caducidad', 'Proyectos previos para acreditar experiencia', 'Certificaciones y equipo con funciones y CV', 'Secciones aprobadas guardadas como plantillas']],
    ['Redacción de propuestas', 'Una estructura adaptada a cada pliego y a sus criterios, redactada con el pliego y los datos de tu empresa.', ['Fuentes en cada afirmación', '«Información requerida» en lugar de datos inventados', 'Borrador → Generada por IA → Revisada → Aprobada', 'Editar, regenerar, aprobar o rechazar']],
    ['Criterios y cumplimiento', 'Dónde están los puntos, cómo los cubre tu propuesta y un control final antes de presentar.', ['Puntos por criterio y cobertura', 'Detecta información de precio en la memoria técnica', 'Firma y aprobación económica por una persona', 'Paquete de presentación descargable']],
    ['Pregunta a PROPO', 'Un asistente que solo conoce este proyecto y tu empresa, y te dice de dónde sale cada respuesta.', ['«¿Qué documentación me falta?»', '«¿Qué criterios tienen más peso?»', '«¿Qué podría causar nuestra exclusión?»', 'Las respuestas citan la página del pliego']],
  ];
  return (
    <MkLayout>
      <PageHero eyebrow="Producto" title={<>Todo lo que hace un equipo de licitaciones, <span className="blue">preparado para tu revisión.</span></>} sub="PROPO cubre todo el camino: encontrar la licitación, analizarla, preparar la propuesta y revisarla antes de presentar." />
      <section className="section-tight">
        <div className="mk-wrap">
          <div className="grid-2" style={{ gap: 20 }}>
            {groups.map(([t, d, items]) => (
              <div key={t} className="card card-pad">
                <h3 style={{ fontSize: 20 }}>{t}</h3>
                <p className="muted mt-8">{d}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0', display: 'grid', gap: 8 }}>
                  {items.map((i) => <li key={i} className="row" style={{ alignItems: 'flex-start' }}><LuCheck style={{ width: 15, height: 15, marginTop: 3, flex: 'none', color: 'var(--accent)' }} /><span className="muted">{i}</span></li>)}
                </ul>
              </div>
            ))}
            <div className="card card-pad" style={{ background: 'var(--surface-2)' }}>
              <h3 style={{ fontSize: 20 }}>Próximamente</h3>
              <p className="muted mt-8">Análisis de adjudicaciones anteriores y competidores, flujos de aprobación en equipo, firma electrónica e integraciones con Microsoft 365, Google Drive, Slack y CRM.</p>
            </div>
          </div>
          <div className="row-wrap mt-32">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>Empezar gratis <LuArrowRight /></button>
            <button className="btn btn-secondary btn-lg" onClick={() => startDemo('/app')}>Ver PROPO en acción</button>
          </div>
        </div>
      </section>
    </MkLayout>
  );
}

export function Security() {
  const items: [React.ReactNode, string, string][] = [
    [<LuUsers />, 'Aislamiento por empresa', 'Cada empresa es un espacio de trabajo independiente. Todas las consultas a la base de datos se limitan a tu espacio con seguridad a nivel de fila: una empresa nunca puede leer los datos de otra.'],
    [<LuLock />, 'Cifrado', 'Datos cifrados en tránsito (TLS 1.2+) y en reposo (AES-256) en almacenamiento y base de datos.'],
    [<LuServer />, 'Datos en la UE', 'Documentos y datos alojados en centros de datos de la UE. El procesamiento con IA se hace con proveedores bajo contrato de encargado del tratamiento y sin retención de datos cuando está disponible.'],
    [<LuKeyRound />, 'Acceso seguro a archivos', 'Los archivos nunca son públicos. Las descargas usan enlaces firmados de corta duración, solo para miembros de tu espacio.'],
    [<LuShieldCheck />, 'Control de accesos', 'Roles de propietario, administrador, editor y revisor. Las sesiones caducan y se pueden revocar.'],
    [<LuHistory />, 'Registro de actividad', 'Subidas, aprobaciones, exportaciones, cambios de miembros y borrados quedan registrados con quién hizo qué y cuándo.'],
    [<LuTrash2 />, 'Borrado y exportación', 'Borra un documento, un proyecto o toda tu cuenta cuando quieras. Exporta todos tus datos en un formato portable.'],
    [<LuDatabase />, 'Sin entrenamiento con tus datos', 'Tus documentos y propuestas nunca se usan para entrenar modelos de IA.'],
  ];
  return (
    <MkLayout>
      <PageHero eyebrow="Seguridad" title={<>Tus pliegos y documentos son sensibles. <span className="blue">Los tratamos así.</span></>} sub="PROPO guarda documentación de empresa, datos financieros y propuestas. La seguridad y el RGPD forman parte de la arquitectura desde el principio." />
      <section className="section-tight">
        <div className="mk-wrap">
          <div className="grid-2" style={{ gap: 16 }}>
            {items.map(([ic, t, d]) => (
              <div key={t} className="card card-pad row" style={{ alignItems: 'flex-start', gap: 16 }}>
                <div className="hs-ico">{ic}</div>
                <div><h3 style={{ fontSize: 16 }}>{t}</h3><p className="muted mt-4">{d}</p></div>
              </div>
            ))}
          </div>
          <div className="callout neutral mt-32">
            <LuShieldCheck />
            <div>PROPO todavía no tiene certificaciones ISO 27001, SOC 2 ni ENS. Las publicaremos aquí cuando estén auditadas. Mientras tanto, respondemos a tu cuestionario de seguridad y firmamos un contrato de encargado del tratamiento.</div>
          </div>
        </div>
      </section>
    </MkLayout>
  );
}

export function Resources() {
  const guides: [string, string][] = [
    ['Cómo leer un pliego en una hora', 'Qué mirar primero: objeto, plazos, solvencia, criterios de adjudicación y causas de exclusión.'],
    ['Solvencia: acreditar experiencia y finanzas', 'Cómo se suele acreditar la solvencia técnica y económica y qué tener listo en tu biblioteca.'],
    ['Escribir para los criterios de adjudicación', 'Estructura la memoria técnica según cómo se va a puntuar, no según tu folleto comercial.'],
    ['Las diez causas de exclusión más habituales', 'Precio en el sobre equivocado, firmas que faltan, presentación fuera de plazo y más.'],
  ];
  const glossary: [string, string][] = [
    ['PCAP / PPT', 'Pliego de cláusulas administrativas particulares y pliego de prescripciones técnicas de una licitación.'],
    ['DEUC', 'Documento Europeo Único de Contratación: declaración responsable de capacidad y solvencia que se usa en toda la UE.'],
    ['Solvencia', 'La capacidad económica y técnica que una empresa debe acreditar para participar.'],
    ['Criterios de adjudicación', 'Cómo se puntúan las ofertas: criterios sujetos a juicio de valor y criterios evaluables mediante fórmulas, normalmente el precio.'],
    ['Código CPV', 'Vocabulario Común de Contratos Públicos: la clasificación europea de lo que se compra.'],
    ['TED', 'Tenders Electronic Daily, el suplemento del Diario Oficial de la UE donde se publican las licitaciones europeas.'],
  ];
  return (
    <MkLayout>
      <PageHero eyebrow="Recursos" title="Guías para equipos que licitan." sub="Notas prácticas sobre cómo preparar licitaciones y RFP. Escritas para quienes lo hacen además de su trabajo diario." />
      <section className="section-tight">
        <div className="mk-wrap">
          <div className="grid-2">
            {guides.map(([t, d]) => (
              <div key={t} className="card card-pad">
                <div className="row"><LuBookOpen style={{ width: 16, height: 16, color: 'var(--accent)' }} /><span className="small subtle">Guía · próximamente</span></div>
                <h3 className="mt-12" style={{ fontSize: 18 }}>{t}</h3>
                <p className="muted mt-8">{d}</p>
              </div>
            ))}
          </div>
          <h2 className="mt-48" style={{ fontSize: 26 }}>Glosario de licitaciones</h2>
          <div className="card mt-16">
            {glossary.map(([t, d]) => <div key={t} className="entity"><div><strong>{t}</strong><p className="muted mt-4">{d}</p></div><span /></div>)}
          </div>
        </div>
      </section>
    </MkLayout>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const email = 'hola@propo.example';
  return (
    <MkLayout>
      <PageHero eyebrow="Contacto" title="Hablemos." sub="Preguntas sobre PROPO, planes Enterprise o revisiones de seguridad. La forma más rápida de conocer PROPO es probarlo con una de tus licitaciones." />
      <section className="section-tight">
        <div className="mk-wrap grid-2" style={{ gap: 32, alignItems: 'start' }}>
          <div className="card card-pad">
            {sent ? (
              <div className="empty" style={{ padding: 24 }}>
                <div className="empty-ico"><LuCheck /></div>
                <h3>Mensaje preparado</h3>
                <p>El formulario de contacto no está conectado en esta versión. Escríbenos a la dirección de esta página y te responderemos en un día laborable.</p>
              </div>
            ) : (
              <form className="stack" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="grid-2"><div className="field"><label htmlFor="c-name">Nombre</label><input id="c-name" className="input" required /></div><div className="field"><label htmlFor="c-company">Empresa</label><input id="c-company" className="input" /></div></div>
                <div className="field"><label htmlFor="c-email">Email de trabajo</label><input id="c-email" className="input" type="email" required /></div>
                <div className="field"><label htmlFor="c-msg">¿En qué te podemos ayudar?</label><textarea id="c-msg" className="textarea" required /></div>
                <button className="btn btn-primary">Continuar</button>
              </form>
            )}
          </div>
          <div className="stack">
            <div className="card card-pad"><div className="small muted">Email</div><div className="row mt-4"><span style={{ userSelect: 'all', fontWeight: 600 }}>{email}</span><button className="btn btn-ghost btn-sm btn-icon" aria-label="Copiar email" onClick={() => navigator.clipboard?.writeText(email).then(() => toast('Email copiado', 'ok')).catch(() => toast('Selecciona la dirección para copiarla'))}><LuCopy /></button></div></div>
            <div className="card card-pad"><div className="small muted">Dónde estamos</div><div className="mt-4" style={{ fontWeight: 600 }}>Barcelona, España</div></div>
            <button className="btn btn-secondary" onClick={() => navigate('/signup')}>O empieza gratis ahora <LuArrowRight /></button>
          </div>
        </div>
      </section>
    </MkLayout>
  );
}

function Legal({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <MkLayout>
      <section className="section">
        <div className="mk-wrap prose">
          <div className="eyebrow">Legal</div>
          <h1 className="mt-12">{title}</h1>
          <p className="subtle mt-8">Última actualización: {updated}</p>
          <div className="callout warn mt-24"><LuShieldCheck /><div>Borrador para el MVP. Los datos entre corchetes deben completarse y el texto debe revisarlo un abogado antes del lanzamiento.</div></div>
          <div className="mt-24">{children}</div>
        </div>
      </section>
    </MkLayout>
  );
}

export function Privacy() {
  return (
    <Legal title="Política de privacidad" updated="1 de octubre de 2026">
      <h2>Quiénes somos</h2>
      <p>PROPO es un servicio de [razón social], con domicilio en [dirección] y NIF [NIF] («PROPO»). Somos responsables del tratamiento de los datos de tu cuenta. Para los documentos y datos que tu empresa sube para preparar propuestas actuamos como encargados del tratamiento, conforme a nuestro contrato de encargo.</p>
      <h2>Qué datos tratamos</h2>
      <ul>
        <li>Datos de cuenta: nombre, email profesional, cargo, nombre de la empresa y sector.</li>
        <li>Contenido del espacio de trabajo: pliegos, documentos de empresa, proyectos previos, equipo y propuestas.</li>
        <li>Datos de facturación: plan, facturas y estado de pago. Los datos de tarjeta los gestiona Stripe y PROPO nunca los guarda.</li>
        <li>Datos de uso: eventos de producto para mejorar PROPO y medir su adopción.</li>
      </ul>
      <h2>Para qué y con qué base legal</h2>
      <p>Para prestar el servicio (ejecución del contrato), facturar (contrato y obligación legal), mantener la seguridad (interés legítimo) y, con tu consentimiento, enviarte novedades del producto.</p>
      <h2>Procesamiento con IA</h2>
      <p>Para analizar documentos y redactar contenido enviamos los fragmentos necesarios a proveedores de IA que actúan como subencargados con contrato. Tu contenido no se usa para entrenar modelos.</p>
      <h2>Dónde se guardan</h2>
      <p>En la Unión Europea. Si un subencargado transfiere datos fuera del EEE, aplicamos cláusulas contractuales tipo y medidas adicionales.</p>
      <h2>Cuánto tiempo</h2>
      <p>Mientras tu cuenta esté activa y durante el plazo de conservación que configures para proyectos cerrados (24 meses por defecto). El contenido borrado se elimina de las copias de seguridad en 30 días.</p>
      <h2>Tus derechos</h2>
      <p>Puedes acceder, rectificar, exportar y suprimir tus datos desde Ajustes → Privacidad y datos, o escribiendo a [email de privacidad]. También puedes oponerte, limitar el tratamiento y reclamar ante la Agencia Española de Protección de Datos (AEPD).</p>
    </Legal>
  );
}

export function Terms() {
  return (
    <Legal title="Condiciones del servicio" updated="1 de octubre de 2026">
      <h2>El servicio</h2>
      <p>PROPO ayuda a las empresas a encontrar licitaciones y preparar propuestas. PROPO prepara y revisa contenido; no presenta ofertas en tu nombre.</p>
      <h2>Tu responsabilidad</h2>
      <p>Eres responsable de revisar, aprobar y presentar cada propuesta, incluidos precios, declaraciones y manifestaciones legales. El contenido generado por IA puede contener errores. PROPO no garantiza la adjudicación de ningún contrato.</p>
      <h2>Tu contenido</h2>
      <p>Conservas todos los derechos sobre los documentos y contenidos que subes o creas. Concedes a PROPO solo los derechos necesarios para prestar el servicio.</p>
      <h2>Planes y facturación</h2>
      <p>Las suscripciones se renuevan cada mes o cada año hasta que las canceles. Puedes cancelar en cualquier momento y el plan sigue activo hasta el final del periodo pagado. Los precios no incluyen IVA.</p>
      <h2>Responsabilidad</h2>
      <p>[Cláusula de limitación de responsabilidad, pendiente de redactar por el abogado.]</p>
      <h2>Ley aplicable</h2>
      <p>Estas condiciones se rigen por la ley española. [Cláusula de jurisdicción pendiente.]</p>
    </Legal>
  );
}

export function Cookies() {
  return (
    <Legal title="Política de cookies" updated="1 de octubre de 2026">
      <h2>Qué usamos</h2>
      <p>Cookies y almacenamiento estrictamente necesarios para mantener tu sesión y tus preferencias. Con tu consentimiento, analítica para entender cómo se usa PROPO.</p>
      <h2>Tu elección</h2>
      <p>La analítica está desactivada hasta que la aceptes. Puedes cambiar tu elección en cualquier momento desde el enlace de configuración de cookies del pie de página.</p>
      <h2>Esta versión</h2>
      <p>Esta versión de PROPO guarda tu espacio de trabajo solo en tu navegador (almacenamiento local e IndexedDB) y no usa cookies de seguimiento.</p>
    </Legal>
  );
}

export function FaqPage() { return <MkLayout><section className="section"><div className="mk-wrap"><Faq /></div></section></MkLayout>; }
