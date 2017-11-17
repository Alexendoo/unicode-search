import { InputMessage, CharMessage } from "./messages"
import { names } from "../data/names"

let tagMemory: Uint32Array
let countMemory: Int32Array

export function initSearch(sab: SharedArrayBuffer) {
  tagMemory = new Uint32Array(sab, 0, 1)
  countMemory = new Int32Array(sab, 4, 1)
}

export function search(input: InputMessage) {
  const start = performance.now()

  let sent = 0

  for (const kv of names) {
    const codepoint = kv[0]
    const char = kv[1]

    if (Atomics.load(tagMemory, 0) !== input.tag) {
      break
    }

    if (char.includes(input.input)) {
      const message: CharMessage = {
        codepoint,
        tag: input.tag,
        name: char,
      }

      postMessage(message)
      sent += 1

      Atomics.wait(countMemory, 0, sent)
    }
  }

  console.log("searched for", input.input, "in", performance.now() - start)
}
