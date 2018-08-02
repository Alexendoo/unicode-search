function handle(mem: Int32Array, codepoint: number) {

}

onmessage = event => {
  const sab: SharedArrayBuffer = event.data.sab
  const ports: Array<MessagePort> = event.data.ports

  const i32 = new Int32Array(sab)

  for (const port of ports) {
    port.onmessage = ({data: {codepoint}}) => handle(i32, codepoint)
  }
}
