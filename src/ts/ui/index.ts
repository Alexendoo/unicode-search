import "../../files"

const worker = new Worker("worker.js")
console.log(worker)

const returns: any[] = []
worker.onmessage = ev => {
  returns.push(ev.data)
}

//@ts-ignore
window.worker = worker
