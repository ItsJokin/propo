# Base de conocimiento de licitaciones adjudicadas (España)

Objetivo: que PROPO sepa qué premian y qué penalizan los tribunales de contratación españoles, criterio a criterio y
sector a sector, y lo use al redactar. Solo expedientes de entidades contratantes españolas.

## Cómo funciona

| Fase | Script | Qué hace | Dónde queda |
|---|---|---|---|
| Catálogo | `scripts/knowledge/catalog.mjs` | Lee los ficheros mensuales de datos abiertos de la Plataforma (perfiles propios + plataformas autonómicas agregadas). Guarda cada expediente adjudicado: lotes, CPV, criterios con peso, adjudicatarios, importes, nº de ofertas y enlaces a sus documentos de evaluación. Filtro geográfico obligatorio por registro. | rama `conocimiento`: `catalogo/AAAA-MM.jsonl.gz` |
| Documentos | `scripts/knowledge/harvest.mjs` | Descarga los informes de valoración (tipo 13 de la Plataforma, y los «otros» cuyo nombre lo indica), una petición cada 2,5 s, sin paralelo. Extrae el texto (pdftotext / DOCX), huella SHA-256, control de calidad (escaneados a cola de OCR). No guarda los PDF. | `textos/*.jsonl.gz`, `estado-textos.json` |
| Extracción | `scripts/knowledge/extract.mjs` | IA (Claude, secreto `ANTHROPIC_API_KEY`): criterios, máximos, puntos por empresa, comentarios positivos y negativos del tribunal, exclusiones. Lo deducido va marcado como hipótesis. Sin nombres de personas físicas. | `extraccion/*.jsonl.gz` |
| Lecciones | `scripts/knowledge/lessons.mjs` | Por división CPV: criterio, mejor y peor puntuación, lo premiado y lo criticado, enlace oficial. Cobertura y `ESTADO.md`. | `publico/lecciones/<cpv2>.json` → web `data/conocimiento/` |
| Uso | `src/lib/data/lessons.ts` + `engine.ts` | Al redactar cada sección, las 6 lecciones más parecidas (sector, nombre del criterio, mismo organismo, recientes) van al prompt como orientación; prohibido copiarlas o atribuirlas a la empresa. | — |

Workflow: `.github/workflows/knowledge.yml` («PROPO · conocimiento»), cada 6 horas y a mano con meses concretos.
Cada ejecución continúa donde quedó la anterior (estados en la rama `conocimiento`).

## Inventario de fuentes

| Fuente | Titular | Ámbito | Qué aporta | Acceso | Estado |
|---|---|---|---|---|---|
| Plataforma de Contratación del Sector Público — perfiles alojados (sindicación 643) | Ministerio de Hacienda | Estatal y entidades con perfil en la Plataforma | Expedientes, lotes, criterios, adjudicaciones, PCAP/PPT, actas, informes de valoración | Ficheros mensuales ZIP/ATOM (CODICE), uso libre con cita | **Conectada** (robot cada 10 min + catálogo mensual) |
| Plataformas autonómicas agregadas (sindicación 1044) | Hacienda + CCAA | Comunidades con convenio de agregación | Lo mismo, con menos documentos | Ficheros mensuales ZIP/ATOM | **Conectada** |
| TED | Oficina de Publicaciones UE | Solo compradores con país ESP | Anuncios de adjudicación sobre umbral | API de búsqueda | **Conectada** para adjudicaciones (no aporta informes de valoración) |
| Portales propios de CCAA (Cataluña, Euskadi, Madrid, Andalucía, Galicia, Valencia…) | Cada comunidad | Autonómico y local | Documentos que no se agregan | Variable: muchos sin descarga masiva | Pendiente: inventariar uno a uno qué no llega por la sindicación 1044 |
| Portal de Transparencia | Gobierno de España | AGE | Contratos menores y adjudicaciones | Web | Pendiente (no aporta informes de valoración) |

## Límites conocidos

- Las **ofertas técnicas de los licitadores no se publican** en la Plataforma. Sin ellas no hay clase A (oferta ganadora accesible). Pedirlas por acceso a información pública exige autorización expresa del titular de PROPO y respeta la confidencialidad que declaren las empresas.
- Los informes escaneados quedan en cola de OCR (no implementado aún).
- Las puntuaciones las extrae una IA: se marca la calidad del informe y lo deducido va como hipótesis. Falta la validación con una muestra revisada a mano.
- No se entrena ningún modelo: se usa recuperación (RAG por sector y criterio). El ajuste fino solo tendría sentido con miles de ejemplos validados y con derechos claros.
