export function log (...v: any[]) {
  if (console && console.log) console.log('⚙', ...v)
}

/**
 * e.g. [1,2,3] starts with [1,2]
 *
 * @returns if long starts with short
 */
export function arrayStartsWith (long: any[], short: any[]) {
  return short.every((v, i) => long[i] === v)
}
