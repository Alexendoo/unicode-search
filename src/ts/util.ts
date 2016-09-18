/**
 * e.g. [1,2,3] starts with [1,2]
 *
 * @returns if long starts with short
 */
export function arrayStartsWith(long: any[], short: any[]) {
  return short.every((v, i) => long[i] === v)
}

/**
 * Convert a unicode code point to a JS string
 *
 * @param code unicode code point of the character
 * @returns the character, may be a surrogate pair
 */
export function codePointToChar(code: number): string {
  if (code < 0x10000) {
    return String.fromCharCode(code)
  } else {
    code -= 0x10000
    const high = Math.floor(code >> 10) + 0xD800
    const low = code % 0x400 + 0xDC00
    return String.fromCharCode(high, low)
  }
}

/**
 * Convert a JS character to a codepoint, accounting for
 * surrogate pairs
 *
 * @param char a character (may be a surrogate pair)
 * @returns codepoint of char
 */
export function charToCodePoint(char: string): number {
  const code = char.charCodeAt(0)
  if (char.length > 1 && code >= 0xD800 && code <= 0xDBFF) {
    // code is a high surrogate
    const low = char.charCodeAt(1)
    return (code - 0xD800) * 0x400 + low - 0xDC00 + 0x10000
  } else {
    return code
  }
}

/**
 * Converts a JS string to an array of characters
 *
 * @param str 16-bit unicode string
 * @returns array of full characters (ie including surrogate pairs)
 */
export function stringToCharArray(str: string): string[] {
  const out: string[] = []
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    if (code >= 0xD800 && code <= 0xDBFF) {
      // code is a high surrogate
      out.push(str.substr(i++, 2))
    } else {
      out.push(str[i])
    }
  }
  return out
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
 * Converts an array of UTF-8 bytes to unicode code points
 *
 *          Byte 1   Byte 2   Byte 3   Byte 4
 *         0xxxxxxx
 *         110xxxxx 10xxxxxx
 *         1110xxxx 10xxxxxx 10xxxxxx
 *         11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
 *
 * @param bytes UTF-8 bytes
 * @returns an array of unicode code points
 */
export function utf8ByteArrayToCodePoints(bytes: number[]) {
  const out: number[] = []
  let i = 0
  while (i < bytes.length) {
    const b1 = bytes[i]
    if (b1 < 0b10000000) {
      // 0xxxxxx
      i++
      out.push(b1)
      continue
    }

    // 10xxxxxx - continuation byte [invalid]
    if (b1 < 0b11000000) {
      i++
      continue
    }

    const b2 = bytes[++i]
    if (b2 >> 6 !== 2) continue
    if (b1 < 0b11100000) {
      // 110xxxxx - 2 byte sequence
      out.push(
        (b1 & 0b11111) << 6 | (b2 & 0b111111)
      )
      continue
    }

    const b3 = bytes[++i]
    if (b3 >> 6 !== 2) continue
    if (b1 < 0b11110000) {
      // 1110xxxx - 3 byte sequence
      out.push(
        (b1 & 0b1111) << 12 | (b2 & 0b111111) << 6 | b3 & 0b111111
      )
      continue
    }

    const b4 = bytes[++i]
    if (b4 >> 6 !== 2) continue
    // 11110xxx - 4 byte sequence
    out.push(
      (b1 & 0b111) << 18 | (b2 & 0b111111) << 12 | (b3 & 0b111111) << 6 | b4 & 0b111111
    )
  }
  return out
}
