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

// export default class Initialiser {
//   private initialiser: () => void
//   private input: string
//   private type: InputType

//   constructor(input?: string, type?: InputType) {
//     this.input = input
//     this.setType(type)
//   }

//   initialise(input: string, type: InputType) {
//     this.setType(type)
//     this.input = input
//     this.initialiser()
//   }

//   setType(type: InputType) {
//     if (!type || type === this.type) return
//     log('Δ type:', this.type, '→', type)
//     this.type = type
//     this.clear()
//     switch (type) {
//       case 'bytes':
//         this.initialiser = this.bytesInitialiser
//         break
//       case 'chars':
//         this.initialiser = this.charsInitialiser
//         break
//       case 'name':
//         this.initialiser = this.nameInitialiser
//         break
//     }
//   }

//   clear() {
//     State.cache = undefined
//     self.postMessage({ action: 'clear', type: this.type })
//   }

//   private bytesInitialiser() {
//     return
//   }

//   private charsInitialiser() {
//     const chars = Array.from(this.input)
//     if (State.cache === undefined) {
//       State.cache = {
//         part: chars,
//         full: chars
//       }
//     } else if (arrayStartsWith(chars, State.cache.full)) {
//       const len = State.cache.full.length
//       State.cache.part.push(...chars.slice(len))
//       State.cache.full = chars
//     } else {
//       this.clear()
//       State.cache = {
//         part: chars,
//         full: chars
//       }
//     }

//     log('init chars', 'part', State.cache.part, 'full', State.cache.full)
//   }

//   private nameInitialiser() {
//     return
//   }
// }

