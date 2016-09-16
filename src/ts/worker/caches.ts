/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { arrayStartsWith } from '../util'

interface ICharCache {
  part: string[]
  full: string[]
}

export class CharCache {
  private cache: ICharCache

  /**
   * @returns true if the cache is invalidated
   */
  update(input: string): boolean {
    const chars = Array.from(input)
    if (this.cache === undefined) {
      this.cache = {
        part: chars,
        full: chars
      }
    } else if (arrayStartsWith(chars, this.cache.full)) {
      const len = this.cache.full.length
      this.cache.part.push(...chars.slice(len))
      this.cache.full = chars
    } else {
      this.cache = {
        part: chars,
        full: chars
      }
      return true
    }
    return false
  }

  /**
   * @returns the next character to display
   */
  next(): string {
    return this.cache.part.shift()
  }
}
