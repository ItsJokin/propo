"""Modelo financiero del canal de público general (historias de marcas y productos).

Reutiliza el motor de modelo.py con hipótesis propias de un canal documental de entretenimiento.
Ejecutar: python3 docs/youtube/modelo/masivo.py
Genera: modelo/salida_masivo.md y ../Modelo_YouTube_masivo.xlsx
"""
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from modelo import BASE as _B, simular, resumen, tabla_escenario, e, AQUI

BASE = dict(_B,
    nombre="Base",
    videos=[4,4,4,5,5,5,6,6,6,6,6,6],            # documentales de 12-16 min
    shorts=[8,8,8,10,10,10,12,12,12,12,12,12],
    v_inicial=800, v_final=12000,                 # vistas de un vídeo nuevo en su mes de estreno
    cola=0.25, decaimiento=0.96,                  # tráfico de sugeridos evergreen
    vistas_short=[800,1200,1600,2000,2500,3000,3500,4000,4500,5000,5500,6000],
    avd_min=6.0,                                  # ~40 % de 14-15 min
    subs_por_mil=8, subs_por_mil_short=0.5,
    rpm=2.5,                                      # España ~50 % + Latinoamérica; anunciantes de consumo
    afil_por_mil=0.3, afil_desde=3,               # Amazon Afiliados y libros: residual
    patro_desde=8, patro_cpm=12, patro_por_mes=[1]*12,
    prod_desde=13, prod_conv=0, prod_precio=0,    # sin producto propio en el año 1
    servicios=[0]*12,
    herramientas=[60,60,60,90,90,90,130,130,130,130,130,130],
    edicion_por_video=[0,0,0,0,150,150,150,150,150,150,150,150],      # el propietario edita hasta la puerta del día 90; externo desde el mes 5
    guion_por_video=[15]*12,                      # licencias de stock/archivo por vídeo
    otros=[100,10,10,10,10,10,150,150,150,150,150,150],   # alta de autónomo cuando hay ingresos recurrentes
)
CONSERVADOR = dict(BASE, nombre="Conservador",
    v_inicial=300, v_final=3000, cola=0.20, avd_min=5.0, subs_por_mil=6,
    vistas_short=[300,400,500,600,700,800,900,1000,1100,1200,1300,1400],
    rpm=1.5, afil_por_mil=0.15, patro_desde=13,
    edicion_por_video=[0]*12, herramientas=[50,50,50,50,90,90,90,90,90,90,90,90],
    otros=[100]+[10]*11,
)
OPTIMISTA = dict(BASE, nombre="Optimista",
    videos=[4,5,6,6,6,8,8,8,8,8,8,8],
    v_inicial=2000, v_final=40000, cola=0.30, avd_min=7.0, subs_por_mil=10,
    vistas_short=[2000,3000,4000,5000,6000,7000,8000,9000,10000,11000,12000,13000],
    rpm=3.5, afil_por_mil=0.5, patro_desde=5, patro_cpm=15, patro_por_mes=[1,1,1,1,1,1,2,2,2,2,2,2],
    edicion_por_video=[0,0,180,180,180,180,180,180,180,180,180,180],
    guion_por_video=[15,15,15,15,15,75,75,75,75,75,75,75],
    otros=[100,10,10,150,150,150,150,150,150,150,150,150],
)

def main():
    out = []
    escenarios = [CONSERVADOR, BASE, OPTIMISTA]
    res = {}
    for p in escenarios:
        fs = simular(p); r = resumen(fs); res[p["nombre"]] = (fs, r)
        out.append(f"\n### Escenario {p['nombre']}\n")
        out.append(tabla_escenario(fs))
        out.append(f"Resumen: ingresos 12m {e(r['ingresos'])} €, costes {e(r['costes'])} €, BAI {e(r['bai'])} €, caja mínima {e(r['caja_min'])} €, YPP desde {r['mon']}, primer mes con beneficio: {r['equilibrio_sin_servicios']}, ingresos mes 12 {e(r['ingreso_m12'])} €, BAI mes 12 {e(r['bai_m12'])} €, vistas largas mes 12 {e(r['vistas_m12'])}, suscriptores mes 12 {e(r['subs_m12'])}.\n")
    sens = [
        ("Base", {}),
        ("Base con edición propia todo el año (sin externalizar)", dict(edicion_por_video=[0]*12)),
        ("Visualizaciones −50 %", dict(factor_vistas=0.5)),
        ("RPM a la mitad", dict(factor_rpm=0.5)),
        ("Producción al doble de coste", dict(factor_coste=2.0)),
        ("Monetización YPP 6 meses más tarde", dict(monetizacion_minima=99)),
        ("Un vídeo viral (+1.000.000 vistas en el mes 5)", dict(viral={4:1_000_000})),
        ("Pérdida de recomendaciones desde el mes 8", dict(sin_recomendacion_desde=7)),
    ]
    out.append("\n### Sensibilidad (escenario base)\n")
    out.append("| Caso | Ingresos 12m € | Costes 12m € | BAI 12m € | Caja mínima € | YPP | Ingresos mes 12 € | BAI mes 12 € |")
    out.append("|---|---|---|---|---|---|---|---|")
    sres = []
    for n, aj in sens:
        r = resumen(simular(BASE, aj)); sres.append((n, r))
        out.append(f"| {n} | {e(r['ingresos'])} | {e(r['costes'])} | {e(r['bai'])} | {e(r['caja_min'])} | {r['mon']} | {e(r['ingreso_m12'])} | {e(r['bai_m12'])} |")
    out.append("\n### Análisis inverso (canal maduro)\n")
    out.append("| Mezcla | 1.000 €/mes | 3.000 €/mes | 5.000 €/mes | 10.000 €/mes |")
    out.append("|---|---|---|---|---|")
    for nombre, pm in (("Solo anuncios, RPM 2,5 €", 2.5), ("Anuncios 3 € + patrocinio 2 € + afiliación y merchandising 0,5 € = 5,5 €/mil", 5.5)):
        out.append(f"| {nombre} | " + " | ".join(e(o/pm*1000)+" vistas" for o in (1000,3000,5000,10000)) + " |")
    open(os.path.join(AQUI, "salida_masivo.md"), "w").write("\n".join(out) + "\n")

    wb = Workbook(); wb.remove(wb.active)
    head = PatternFill("solid", fgColor="1F3A5F"); white = Font(bold=True, color="FFFFFF")
    keys = ["mes","videos","shorts","v_nuevos","v_catalogo","v_largos","v_shorts","horas12","subs","estado","ads","afil","patro","prod","serv","ingresos","c_herr","c_ed","c_otros","costes","bai","caja"]
    for p in escenarios:
        w = wb.create_sheet(p["nombre"])
        w.append(["Mes","Vídeos largos","Shorts","Vistas vídeos nuevos","Vistas catálogo","Vistas largos total","Vistas Shorts","Horas públicas 12m","Suscriptores","Estado YPP","Anuncios €","Afiliación €","Patrocinio €","Producto €","Servicios €","Ingresos €","Herramientas €","Edición y licencias €","Otros €","Costes €","BAI €","Caja acumulada €"])
        for f in res[p["nombre"]][0]:
            w.append([round(f[k]) if isinstance(f[k], float) else f[k] for k in keys])
        for r in range(2, 14):
            w[f"P{r}"] = f"=K{r}+L{r}+M{r}+N{r}+O{r}"; w[f"T{r}"] = f"=Q{r}+R{r}+S{r}"
            w[f"U{r}"] = f"=P{r}-T{r}"; w[f"V{r}"] = f"=U{r}" if r == 2 else f"=V{r-1}+U{r}"
        w.append([]); w.append(["Hipótesis"])
        for k, v in p.items(): w.append([k, str(v)])
        for c in w[1]: c.font = white; c.fill = head; c.alignment = Alignment(wrap_text=True)
    w = wb.create_sheet("Sensibilidad")
    w.append(["Caso","Ingresos 12m €","Costes 12m €","BAI 12m €","Caja mínima €","YPP","Ingresos mes 12 €","BAI mes 12 €"])
    for n, r in sres:
        w.append([n, round(r["ingresos"]), round(r["costes"]), round(r["bai"]), round(r["caja_min"]), r["mon"], round(r["ingreso_m12"]), round(r["bai_m12"])])
    for c in w[1]: c.font = white; c.fill = head
    import ideas_masivo
    w = wb.create_sheet("Banco 100 ideas")
    w.append(["#","Categoría","Título","Concepto","Por qué interesa","Gancho","Estructura","Recursos","Dificultad","Diferenciación","Riesgos","Descubrimiento","Evergreen","Facilidad","Coste €","Intención","Competencia","Comercial","Encaje"])
    k = 0
    for cat, lista in ideas_masivo.CATEGORIAS:
        for i in lista:
            k += 1; w.append([k, cat, *i])
    for c in w[1]: c.font = white; c.fill = head
    wb.save(os.path.join(os.path.dirname(AQUI), "Modelo_YouTube_masivo.xlsx"))

if __name__ == "__main__":
    main()
