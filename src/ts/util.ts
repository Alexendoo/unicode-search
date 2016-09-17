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
 * adapted from http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
 *
 * @param str a utf16 string
 * @returns a utf8 string
 */
export function utf16to8(str: string): string {
  let out = ''
  const len = str.length
  for (let i = 0; i < len; i++) {
    const code = str.charCodeAt(i)
    if ((code >= 0x0001) && (code <= 0x007F)) {
      out += str.charAt(i)
    } else if (code > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((code >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((code >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((code >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((code >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((code >> 0) & 0x3F))
    }
  }
  return out
}

/**
 * adapted from http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
 *
 * @param str a utf8 string
 * @returns a utf16 string
 */
export function utf8to16(str: string): string {
  let out = ''
  let i = 0
  const len = str.length
  while (i < len) {
    const c = str.charCodeAt(i++)
    let char2: number
    let char3: number
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1)
        break
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F))
        break
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++)
        char3 = str.charCodeAt(i++)
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0))
        break
    }
  }
  return out
}
