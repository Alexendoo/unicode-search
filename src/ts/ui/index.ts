import "../../files"
import { InputMessage } from "../worker/messages"

const worker = new Worker("worker.js")
console.log(worker)

worker.onmessage = ev => {
  console.log(ev.data)
}

const sab = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT)
const uint32 = new Uint32Array(sab, 0, 1)
const int32 = new Int32Array(sab, 4, 1)

worker.postMessage(sab)

//@ts-ignore
window.worker = worker
//@ts-ignore
window.uint32 = uint32
//@ts-ignore
window.int32 = int32

const input = document.getElementById("chars") as HTMLInputElement

input.addEventListener("input", ev => {
  const oldTag = Atomics.add(uint32, 0, 1)

  Atomics.store(int32, 0, 2)
  Atomics.wake(int32, 0, 1)

  const message: InputMessage = {
    input: input.value.toUpperCase(),
    tag: oldTag + 1,
  }

  worker.postMessage(message)
})
