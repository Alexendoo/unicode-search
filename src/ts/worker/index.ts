import { InputMessage, CharMessage } from "./messages"
import { names } from "../data/names"

let tagMemory: Uint32Array
let countMemory: Int32Array

onmessage = event => {
  const input: InputMessage | SharedArrayBuffer = event.data

  if (input instanceof SharedArrayBuffer) {
    tagMemory = new Uint32Array(input, 0, 1)
    countMemory = new Int32Array(input, 4, 1)
    return
  }

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
      }

      postMessage(message)
      sent += 1
      Atomics.wait(countMemory, 0, sent)
    }
  }

  console.log("searched for", input.input, "in", performance.now() - start)
}
