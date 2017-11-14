import { InputMessage } from "./messages"
import names from "../data/names"

onmessage = event => {
  const message: InputMessage = event.data

  const start = performance.now()

  for (const codepoint in names) {
    const char = names[codepoint]

    if (char.includes(message.input)) {
      postMessage(codepoint)
    }
  }

  console.log("searched for", message.input, "in", performance.now() - start)
}
