import "../../files"
import { InputMessage, CharMessage } from "../worker/messages"
import { names } from "../data/names"

const sab = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT)
const uint32 = new Uint32Array(sab, 0, 1)
const int32 = new Int32Array(sab, 4, 1)

const app = document.getElementById("app")
const input = document.getElementById("chars") as HTMLInputElement

const worker = new Worker("worker.js")
worker.postMessage(sab)

function clearNode(node: Node) {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild)
  }
}

function sendMessage() {
  const oldTag = Atomics.add(uint32, 0, 1)

  Atomics.store(int32, 0, 3)
  Atomics.wake(int32, 0, 1)

  const message: InputMessage = {
    input: input.value.toUpperCase(),
    tag: oldTag + 1,
  }

  worker.postMessage(message)
  clearNode(app)
}

function receiveMessage(event: MessageEvent) {
  const message: CharMessage = event.data

  app.insertAdjacentHTML(
    "beforeend",
    `
    <p>${message.codepoint} - ${names.get(message.codepoint)}</p>
    `,
  )
}

worker.addEventListener("message", receiveMessage)
input.addEventListener("input", sendMessage)

declare global {
  interface Window {
    [key: string]: any
  }
}

window.worker = worker
window.uint32 = uint32
window.int32 = int32
