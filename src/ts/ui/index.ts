import "../../files"

const worker = new Worker("worker.js")
console.log(worker)

const returns: any[] = []
worker.onmessage = ev => {
  returns.push(ev.data)
}

const sab = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT)
const uint32 = new Uint32Array(sab)

worker.postMessage(sab)

//@ts-ignore
window.worker = worker
//@ts-ignore
window.uint32 = uint32
