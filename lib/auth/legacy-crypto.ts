/**
 * Cifrado/descifrado legado usado por FoxPro.
 *
 * Algoritmo original:
 *   encrypted_byte = (plain_byte * 2 - 2) mod 256
 *   plain_byte     = (encrypted_byte + 2) / 2
 *
 * FoxPro opera sobre bytes del codepage activo (Windows-1252). Por eso se
 * codifica el texto a bytes antes de cifrar y se decodifica el resultado
 * nuevamente a caracteres Unicode.
 *
 * Nota: como la multiplicación puede rebasar 255, `encrypt` aplica `mod 256`
 * para emular el comportamiento de CHR() sobre un byte. Eso hace que ciertos
 * caracteres extendidos no sean recuperables por `decrypt`; en la práctica
 * las contraseñas del sistema legado usan caracteres dentro del rango que no
 * genera colisión.
 */

/** Mapeo de bytes Windows-1252 a caracteres Unicode (0x80-0x9F). */
const WIN1252_TO_UNICODE: Record<number, string> = {
  0x80: '\u20AC',
  0x82: '\u201A',
  0x83: '\u0192',
  0x84: '\u201E',
  0x85: '\u2026',
  0x86: '\u2020',
  0x87: '\u2021',
  0x88: '\u02C6',
  0x89: '\u2030',
  0x8a: '\u0160',
  0x8b: '\u2039',
  0x8c: '\u0152',
  0x8e: '\u017D',
  0x91: '\u2018',
  0x92: '\u2019',
  0x93: '\u201C',
  0x94: '\u201D',
  0x95: '\u2022',
  0x96: '\u2013',
  0x97: '\u2014',
  0x98: '\u02DC',
  0x99: '\u2122',
  0x9a: '\u0161',
  0x9b: '\u203A',
  0x9c: '\u0153',
  0x9e: '\u017E',
  0x9f: '\u0178'
}

/** Mapeo inverso de caracteres Unicode a bytes Windows-1252. */
const UNICODE_TO_WIN1252: Record<string, number> = {}
for (const [byte, char] of Object.entries(WIN1252_TO_UNICODE)) {
  UNICODE_TO_WIN1252[char] = Number(byte)
}

/** Codifica un string a bytes usando Windows-1252. */
const encodeWin1252 = (text: string): Uint8Array => {
  const bytes = new Uint8Array(text.length)
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const code = char.charCodeAt(0)

    if (code <= 0x7f) {
      bytes[i] = code
    } else if (code >= 0xa0 && code <= 0xff) {
      bytes[i] = code
    } else if (UNICODE_TO_WIN1252[char] !== undefined) {
      bytes[i] = UNICODE_TO_WIN1252[char]
    } else if (code <= 0xff) {
      // C1 controls u otros bytes sin glifo asignado; se conservan tal cual
      // para mantener la ronda con datos provenientes de SQL Server.
      bytes[i] = code
    } else {
      throw new Error(
        `Carácter no representable en Windows-1252: "${char}" (U+${code.toString(16).padStart(4, '0')})`
      )
    }
  }
  return bytes
}

/** Decodifica bytes Windows-1252 a string. */
const decodeWin1252 = (bytes: Uint8Array): string => {
  let result = ''
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i]
    if (b <= 0x7f || (b >= 0xa0 && b <= 0xff)) {
      result += String.fromCharCode(b)
    } else {
      result += WIN1252_TO_UNICODE[b] ?? String.fromCharCode(b)
    }
  }
  return result
}

/** Cifra texto plano usando la fórmula legada de FoxPro. */
export const encrypt = (plain: string): string => {
  const input = encodeWin1252(plain)
  const output = new Uint8Array(input.length)

  for (let i = 0; i < input.length; i++) {
    const b = input[i]
    output[i] = ((b * 2 - 2) & 0xff) >>> 0
  }

  return decodeWin1252(output)
}

/** Descifra texto cifrado con el algoritmo FoxPro. */
export const decrypt = (encrypted: string): string => {
  const input = encodeWin1252(encrypted)
  const output = new Uint8Array(input.length)

  for (let i = 0; i < input.length; i++) {
    const b = input[i]
    output[i] = Math.round((b + 2) / 2) & 0xff
  }

  return decodeWin1252(output)
}
