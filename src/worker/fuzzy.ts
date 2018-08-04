import { names, length } from "../data/names"
import { Offset } from "../shared/memory"

function main(mem: Int32Array, pid: number) {
  const outIndex = Offset.InputEnd + pid * Offset.ResultEnd
  const wakeSelf = outIndex + Offset.WakeFuzzer

  const pidFlag = 1 << pid

  while (true) {
    const turn = Atomics.load(mem, Offset.Turn)
    Atomics.wait(mem, Offset.WakeAllFuzzers, 0)

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      const index = Atomics.add(mem, Offset.Index, 1)

      if (index >= length) {
        break
      }

      const { name, codepoint } = names[index]

      mem[outIndex + Offset.Codepoint] = codepoint

      Atomics.store(mem, wakeSelf, 0)
      Atomics.or(mem, Offset.PIDFlags, pidFlag)
      Atomics.wake(mem, Offset.PIDFlags, 1)
      Atomics.wait(mem, wakeSelf, 0)
    }

    console.log("done")
  }
}

onmessage = event => {
  postMessage(null)
  main(new Int32Array(event.data.sab), event.data.pid)
}
