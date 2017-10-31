import {
  arrayStartsWith,
  codePointToChar,
  stringToCharArray,
  utf8ByteArrayToCodePoints,
} from "../util"
import { State } from "./state"

interface ICharCache {
  part: string[]
  full: string[]
}

export interface ICache {
  /**
   * Update the cache with the new input, if the cache
   * is invalidated and the browser UI needs to be cleared,
   * returns true
   *
   * @param input user supplied input
   * @returns if the cache is invalidated
   */
  update(input: string): boolean

  /**
   * Receive the next character from the cache to display
   *
   * @returns the next character
   */
  next(): string
}

export class ByteCache implements ICache {
  private chars: string[]
  private valid: boolean

  update(input: string): boolean {
    // strip whitespace
    input = input.replace(/\s/g, "")

    // ignore non-hex inputs
    this.valid = /^[0-9a-f]{2,}$/i.test(input)
    if (!this.valid) return true

    const bytes = input.match(/../g).map(byte => parseInt(byte, 16))

    this.chars = utf8ByteArrayToCodePoints(bytes).map(code =>
      codePointToChar(code),
    )

    return true
  }

  next() {
    if (this.valid) return this.chars.shift()
  }
}

// TODO: No reason to store cache in object
export class CharCache implements ICache {
  private cache: ICharCache

  update(input: string): boolean {
    const chars = stringToCharArray(input)
    if (this.cache === undefined) {
      this.cache = {
        part: chars,
        full: chars.slice(),
      }
      return true
    } else if (arrayStartsWith(chars, this.cache.full)) {
      const len = this.cache.full.length
      this.cache.part.push(...chars.slice(len))
      this.cache.full = chars
      return false
    } else {
      this.cache = {
        part: chars,
        full: chars.slice(),
      }
      return true
    }
  }

  next(): string {
    return this.cache.part.shift()
  }
}

export class NameCache implements ICache {
  private queue: string[]

  update(input: string): boolean {
    this.queue = []
    if (!State.names || !input) return
    input = input.toUpperCase()
    for (let key in State.names) {
      const name = State.names[key]
      if (name.indexOf(input) >= 0) {
        this.queue.push(codePointToChar(Number(key)))
      }
    }
    return true
  }

  next(): string {
    return this.queue.shift()
  }
}
