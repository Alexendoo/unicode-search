import { names, length } from "../data/names"
import { Offset, FuzzerState, CoordinatorState } from "../shared/memory"

function main(mem: Int32Array, pid: number) {
  Atomics.wait(mem, Offset.Turn, 0)
  const outIndex = Offset.InputEnd + pid * Offset.ResultEnd

  while (true) {
    const turn = Atomics.load(mem, Offset.Turn)

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      const index = Atomics.add(mem, Offset.Index, 1)

      if (index >= length) {
        break
      }

      const { name, codepoint } = names[index]

      Atomics.store(mem, outIndex + Offset.Codepoint, codepoint)

      Atomics.store(mem, outIndex + Offset.Fuzzer, FuzzerState.Complete)
      Atomics.store(mem, Offset.Coordinator, CoordinatorState.HasResult)
      Atomics.wake(mem, Offset.Coordinator, 1)
      Atomics.wait(mem, outIndex + Offset.Fuzzer, FuzzerState.Complete)
    }

    // console.log("done")
  }
}

onmessage = event => {
  postMessage(null)
  main(new Int32Array(event.data.sab), event.data.pid)
}
