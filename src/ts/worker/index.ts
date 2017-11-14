import { InputMessage } from "./messages"
import names from "../../data/names"

onmessage = event => {
  const data: InputMessage = event.data
  const input = data.input.toUpperCase()

  const start = performance.now()

  for (const codepoint in names) {
    const char = names[codepoint]

    if (char.includes(input)) {
      postMessage(codepoint)
    }
  }

  console.log(performance.now() - start)
}
