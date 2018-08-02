function handle(mem: Int32Array, codepoint: number) {}

onmessage = event => {
  const mem = new Int32Array(event.data.sab)
  const concurrency = event.data.concurrency

  console.log(concurrency, mem)
}
