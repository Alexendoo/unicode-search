import { InputMessage, CharMessage } from "./messages"
import { names } from "../data/names"
import { search, initSearch } from "./search"

let tagMemory: Uint32Array
let countMemory: Int32Array

onmessage = event => {
  const input: InputMessage | SharedArrayBuffer = event.data

  if (input instanceof SharedArrayBuffer) {
    initSearch(input)
    return
  }

  search(input)
}
