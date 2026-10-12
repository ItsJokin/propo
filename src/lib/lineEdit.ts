// Quitar de una línea de la propuesta la frase que dependía de un dato que no se va a incluir.

/** Sin IA: la línea sin la frase que pedía el dato. Devuelve '' si no queda nada que merezca la pena. */
export function lineWithout(line: string, tag: string) {
  if (/^\s*([-*•|]|\d+[.)])/.test(line)) return '';                      // punto de lista o fila de tabla: se va entero
  const i = line.indexOf(tag);
  const before = line.slice(0, i), after = line.slice(i + tag.length);
  const from = before.lastIndexOf('. ') + 1;                             // 0 si la marca está en la primera frase
  const end = after.search(/\.(\s|$)/);
  const rest = `${before.slice(0, from).trimEnd()} ${end >= 0 ? after.slice(end + 1).trimStart() : ''}`.trim();
  return rest.replace(/\[S\d+\]/g, '').trim().length < 25 ? '' : rest;
}
