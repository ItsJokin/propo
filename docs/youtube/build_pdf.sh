#!/usr/bin/env bash
# Compone Informe_YouTube_Mano_Extra.pdf a partir de los capítulos Markdown (pandoc + Chromium/Playwright).
set -euo pipefail
cd "$(dirname "$0")"
TMP="$(mktemp -d)"
cat > "$TMP/estilo.css" <<'CSS'
@page { size: A4 landscape; margin: 14mm 12mm; }
body { font-family: "DejaVu Sans", Arial, sans-serif; font-size: 10pt; line-height: 1.45; color: #2B2B2B; max-width: none; }
h1 { color: #1F3A5F; border-bottom: 3px solid #FF7A1A; padding-bottom: 4px; page-break-before: always; font-size: 20pt; }
h1:first-of-type { page-break-before: avoid; }
h2 { color: #1F3A5F; font-size: 14pt; margin-top: 1.4em; }
h3 { color: #1F3A5F; font-size: 11.5pt; }
table { border-collapse: collapse; width: 100%; font-size: 7.6pt; margin: 8px 0 14px; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th { background: #1F3A5F; color: #fff; padding: 4px; text-align: left; vertical-align: top; }
td { border: 1px solid #C9CED6; padding: 3px 4px; vertical-align: top; }
td:first-child { white-space: nowrap; }
tr:nth-child(even) td { background: #F6F3EE; }
blockquote { border-left: 4px solid #FF7A1A; margin: 6px 0; padding: 4px 10px; background: #FBF8F3; }
code, pre { font-family: "DejaVu Sans Mono", monospace; font-size: 8.5pt; background: #F6F3EE; }
pre { padding: 8px; white-space: pre-wrap; }
#TOC { page-break-after: always; columns: 2; font-size: 9pt; }
#TOC ul { list-style: none; padding-left: 12px; }
header#title-block-header { text-align: center; padding-top: 50mm; page-break-after: always; }
header#title-block-header .title { font-size: 28pt; color: #1F3A5F; border: none; }
header#title-block-header .subtitle { font-size: 14pt; color: #FF7A1A; }
header#title-block-header .date { font-size: 12pt; }
a { color: #1F3A5F; word-break: break-all; }
CSS
if [ "${1:-}" = "v2" ]; then
  CAPS="20_nicho_publico_general.md 02_mercado_y_matriz.md 04_formatos_y_recomendacion.md 12_politicas_y_legal.md 13_medicion_y_decisiones.md 15_fuentes.md"
  SALIDA="Informe_v2_Publico_General_Codigo_de_Barras.pdf"; SUB="Versión 2: nicho de público general (Código de Barras)"
else
  CAPS="01_resumen_y_metodologia.md 02_mercado_y_matriz.md 03_top10_nichos.md 04_formatos_y_recomendacion.md 05_marca.md 06_banco_ideas.md 07_diez_videos_y_guiones.md 08_sistema_produccion.md 09_calendario_y_crecimiento.md 10_modelo_financiero.md 11_monetizacion_acelerada.md 12_politicas_y_legal.md 13_medicion_y_decisiones.md 14_escalado_y_plan_de_accion.md 15_fuentes.md"
  SALIDA="Informe_YouTube_Mano_Extra.pdf"; SUB="Estudio de mercado, decisión y plan de ejecución: Mano Extra"
fi
pandoc $CAPS \
  -f gfm -t html5 -s --toc --toc-depth=2 --embed-resources --css "$TMP/estilo.css" \
  --metadata title="Negocio de YouTube sin rostro" \
  --metadata subtitle="$SUB" \
  --metadata date="Investigación: 26 de octubre de 2026" --metadata lang=es \
  -o "$TMP/informe.html"
node -e '
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto("file://" + process.argv[1]);
  await p.pdf({ path: process.argv[2], format: "A4", landscape: true, printBackground: true,
    displayHeaderFooter: true, headerTemplate: "<span></span>",
    footerTemplate: "<div style=\"font-size:7pt;width:100%;text-align:center;color:#777\">Estudio de negocio YouTube · <span class=pageNumber></span>/<span class=totalPages></span></div>",
    margin: { top: "12mm", bottom: "14mm", left: "10mm", right: "10mm" } });
  await b.close();
})();' "$TMP/informe.html" "$PWD/$SALIDA"
rm -rf "$TMP"
echo "PDF generado: $PWD/$SALIDA"
