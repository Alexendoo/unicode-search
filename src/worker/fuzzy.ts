import { names, length } from "../data/names"
import { Offset } from "../shared/memory"
import { lock } from "../shared/mutex"

function main(mem: Int32Array, pid: number) {
  let turn = 0
  while (true) {
    Atomics.wait(mem, Offset.Turn, turn)
    turn = Atomics.load(mem, Offset.Turn)

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      const index = Atomics.add(mem, Offset.Index, 1)

      if (index >= length) {
        break
      }

      const { name, codepoint } = names[index]

      lock(mem, Offset.Mutex)

      Atomics.store(mem, Offset.Codepoint, codepoint)

      Atomics.store(mem, Offset.Coordinator, 1)
      Atomics.wake(mem, Offset.Coordinator, 1)
    }

    // console.log("done")
  }
}

onmessage = event => {
  postMessage(null)
  main(new Int32Array(event.data.sab), event.data.pid)
}
