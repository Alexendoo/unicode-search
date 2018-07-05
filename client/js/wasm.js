const importObject = {
  imports: {
    console_panic: arg => console.error(arg),
    console_oom: () => console.error("oom"),
  },
}

async function go() {
  const request = fetch("wasm/general_suffix.wasm")
  try {
    const ret = await WebAssembly.instantiateStreaming(request, importObject)

    window.w = ret
    console.log(ret)
  } catch (e) {
    window.oops = e
    console.error(e)
  }
}

go()
