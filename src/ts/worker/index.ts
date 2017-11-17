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

  for (const codepoint in names) {
    if (Atomics.load(tagMemory, 0) !== input.tag) {
      break
    }

    const char = names[codepoint]

    if (char.includes(input.input)) {
      const message: CharMessage = {
        codepoint: parseInt(codepoint, 10),
        tag: input.tag,
      }

      postMessage(message)
      sent += 1
      Atomics.wait(countMemory, 0, sent)
    }
  }

  console.log("searched for", input.input, "in", performance.now() - start)
}
