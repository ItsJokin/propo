// Contraseña de la cuenta local. Mientras PROPO no tenga servidor de cuentas, el espacio de trabajo vive en el navegador;
// la contraseña no se guarda: solo su huella (PBKDF2-SHA256 con sal), que es lo que se comprueba al iniciar sesión.
export interface PassHash { salt: string; hash: string; iterations: number }

const hex = (b: ArrayBuffer | Uint8Array) => Array.from(b instanceof Uint8Array ? b : new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
const unhex = (s: string) => new Uint8Array((s.match(/../g) || []).map((x) => parseInt(x, 16)));

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}

/** Huella de una contraseña nueva; `null` si el navegador no ofrece criptografía (página sin HTTPS). */
export async function hashPassword(password: string): Promise<PassHash | null> {
  if (!globalThis.crypto?.subtle) return null;
  const salt = crypto.getRandomValues(new Uint8Array(16)), iterations = 210000;
  return { salt: hex(salt), hash: await derive(password, salt, iterations), iterations };
}

export async function checkPassword(password: string, p: PassHash): Promise<boolean> {
  if (!globalThis.crypto?.subtle) return false;
  return (await derive(password, unhex(p.salt), p.iterations)) === p.hash;
}
