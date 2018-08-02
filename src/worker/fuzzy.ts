import { names, length } from "../data/names"
import { Offset } from "../shared/memory"

function main(mem: Int32Array, pid: number) {
  while (true) {
    const id = Atomics.load(mem, Offset.Turn)
    Atomics.wait(mem, Offset.Turn, id)

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== id) {
        break
      }

      const index = Atomics.add(mem, Offset.Index, 1)

      if (index >= length) {
        break
      }

      const { name, codepoint } = names[index]

      const outIndex = Offset.InputEnd + pid * Offset.ResultEnd
      mem[outIndex + Offset.Codepoint] = codepoint

      Atomics.and(mem, Offset.PIDFlags, 1 << pid)
      Atomics.wake(mem, Offset.PIDFlags, 1)
    }

    console.log("done")
  }
}

onmessage = event => {
  main(new Int32Array(event.data.sab), event.data.pid)
}
