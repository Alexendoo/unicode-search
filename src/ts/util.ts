export function log(...v: any[]) {
  if (console && console.log) console.log('⚙', ...v)
}

/**
 * e.g. [1,2,3] starts with [1,2]
 *
 * @returns if long starts with short
 */
export function arrayStartsWith(long: any[], short: any[]) {
  return short.every((v, i) => long[i] === v)
}

/**
 * Converts a JS string to a UTF-8 "byte" array.
 *
 * Adapted from https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 *
 * @license Apache-2.0
 * @param str 16-bit unicode string.
 * @return UTF-8 byte array.
 */
export function stringToUtf8ByteArray(str: string): number[] {
  const out: number[] = []
  let p = 0
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i)
    if (code < 128) {
      out[p++] = code
    } else if (code < 2048) {
      out[p++] = (code >> 6) | 192
      out[p++] = (code & 63) | 128
    } else if (
        ((code & 0xFC00) === 0xD800) && (i + 1) < str.length &&
        ((str.charCodeAt(i + 1) & 0xFC00) === 0xDC00)) {
      // Surrogate Pair
      code = 0x10000 + ((code & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      out[p++] = (code >> 18) | 240
      out[p++] = ((code >> 12) & 63) | 128
      out[p++] = ((code >> 6) & 63) | 128
      out[p++] = (code & 63) | 128
    } else {
      out[p++] = (code >> 12) | 224
      out[p++] = ((code >> 6) & 63) | 128
      out[p++] = (code & 63) | 128
    }
  }
  return out
}

/**
 * Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
 *
 * Adapted from https://github.com/google/closure-library/blob/master/closure/goog/crypt/crypt.js
 *
 * @license Apache-2.0
 * @param bytes UTF-8 byte array.
 * @return 16-bit Unicode string.
 */
export function utf8ByteArrayToString(bytes: number[]|Uint8Array) {
  const out: string[] = []
  let pos = 0
  let c = 0
  while (pos < bytes.length) {
    const c1 = bytes[pos++]
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1)
    } else if (c1 > 191 && c1 < 224) {
      const c2 = bytes[pos++]
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63)
    } else if (c1 > 239 && c1 < 365) {
      // Surrogate Pair
      const c2 = bytes[pos++]
      const c3 = bytes[pos++]
      const c4 = bytes[pos++]
      const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63)
        - 0x10000
      out[c++] = String.fromCharCode(0xD800 + (u >> 10))
      out[c++] = String.fromCharCode(0xDC00 + (u & 1023))
    } else {
      const c2 = bytes[pos++]
      const c3 = bytes[pos++]
      out[c++] =
          String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63)
    }
  }
  return out.join('')
}
