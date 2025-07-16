/** userByCUIL.ts
 *  Llama al Apps Script pasándole cuil, user y password.
 */

interface AddressData {
  domicilio: string | null;
  localidad: string | null;
}

interface AuthHeaders {
  user: string;
  password: string;
}

/* ⬇⬇⬇  Nueva URL del Apps Script  ⬇⬇⬇ */
const APPSCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbygoxMOFlapb__4YM5uaqqPbNU5j33sXFIMcWLu6Li4pqzE5e4pnauxUuSJWTnWIDDn8A/exec";

export async function userByCUIL(
  { pCUIT }: { pCUIT: string },
  headers: AuthHeaders
): Promise<AddressData[]> {
  if (!pCUIT) throw new Error("pCUIT requerido");
  if (!headers?.user || !headers?.password)
    throw new Error("Headers user y password requeridos");

  const url =
    `${APPSCRIPT_URL}?` +
    `cuil=${encodeURIComponent(pCUIT)}` +
    `&user=${encodeURIComponent(headers.user)}` +
    `&password=${encodeURIComponent(headers.password)}`;

  const res = await fetch(url, { method: "POST", body: "" });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const data : any = await res.json();

  if (!data.encontrado) return [];

  return (data.direcciones as any[]).map((d) => ({
    domicilio: d.domicilio ?? null,
    localidad: d.localidad ?? null,
  }));
}

/* Helper para compatibilidad con index.ts */
export async function getUserByCUIL(
  pCUIT: string,
  headers: AuthHeaders
): Promise<AddressData[]> {
  return userByCUIL({ pCUIT }, headers);
}
