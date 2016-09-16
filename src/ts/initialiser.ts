/// <reference path="../../node_modules/typescript/lib/lib.webworker.d.ts" />

import * as Messages from './messages'
import { arrayStartsWith, log } from './util'

let cache: any
const initialisers: any = {

  chars (input: string, type: Messages.InputType) {
    const chars = Array.from(input)
    if (cache === undefined) {
      cache = {
        part: chars,
        full: chars
      }
    } else if (arrayStartsWith(chars, cache.full)) {
      const len = cache.full.length
      cache.part.push(...chars.slice(len))
      cache.full = chars
    } else {
      clear(type)
      cache = {
        part: chars,
        full: chars
      }
    }

    log('init chars', 'part', cache.part, 'full', cache.full)
  },

  name (input: string) {
    return
  },

  bytes (input: string) {
    return
  }

}

export function initialise (input: string, type: Messages.InputType) {
  if (!type || !input) {
    return
  }
  initialisers[type](input, type)
}

/**
 * Flush cache and clear main UI
 */
export function clear (type: Messages.InputType) {
  cache = undefined
  self.postMessage({action: 'clear', type})
}
