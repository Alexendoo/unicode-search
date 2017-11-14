import { InputMessage } from "./messages"
import { names } from "../data/names"

let uint32: Uint32Array

onmessage = event => {
  const message: InputMessage | SharedArrayBuffer = event.data

  if (message instanceof SharedArrayBuffer) {
    uint32 = new Uint32Array(message)
    return
  }

  const start = performance.now()

  for (const codepoint in names) {
    if (Atomics.load(uint32, 0) !== message.tag) {
      console.log("break")
      break
    }

    const char = names[codepoint]

    if (char.includes(message.input)) {
      postMessage(codepoint)
    }
  }

  console.log("searched for", message.input, "in", performance.now() - start)
}
