self.addEventListener("message", event => {
  const sab = (event as MessageEvent).data as SharedArrayBuffer

  console.log(sab)
})
