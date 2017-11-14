import { InputMessage } from "./messages"
import { names } from "../data/names"

let tagMemory: Uint32Array
let countMemory: Int32Array

onmessage = event => {
  const message: InputMessage | SharedArrayBuffer = event.data

  if (message instanceof SharedArrayBuffer) {
    tagMemory = new Uint32Array(message, 0, 1)
    countMemory = new Int32Array(message, 4, 1)
    return
  }

  const start = performance.now()

  let sent = 0

  for (const codepoint in names) {
    if (Atomics.load(tagMemory, 0) !== message.tag) {
      break
    }

    const char = names[codepoint]

    if (char.includes(message.input)) {
      postMessage({
        codepoint: parseInt(codepoint, 10),
        tag: message.tag,
      })
      sent += 1
      Atomics.wait(countMemory, 0, sent)
    }
  }

  console.log("searched for", message.input, "in", performance.now() - start)
}
