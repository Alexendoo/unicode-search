import { Offset } from "../shared/memory"
import { length } from "../data/names";

function main(mem: Int32Array, concurrency: number) {
  while (true) {
    const turn = Atomics.load(mem, Offset.Turn)
    Atomics.wait(mem, Offset.Turn, turn)

    Atomics.store(mem, Offset.WakeAllFuzzers, 1)
    Atomics.wake(mem, Offset.WakeAllFuzzers, Infinity)

    const cs = []

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      Atomics.wait(mem, Offset.PIDFlags, 0)
      const flags = Atomics.load(mem, Offset.PIDFlags)

      for (let pid = 0; pid < concurrency; pid++) {
        const pidFlag = 1 << pid
        if ((flags & pidFlag) === 0) {
          continue
        }

        const outIndex = Offset.InputEnd + pid * Offset.ResultEnd

        cs.push(Atomics.load(mem, outIndex + Offset.Codepoint))

        Atomics.and(mem, Offset.PIDFlags, ~pidFlag)
        Atomics.store(mem, outIndex + Offset.WakeFuzzer, 1)
        Atomics.wake(mem, outIndex + Offset.WakeFuzzer, 1)
      }

      if (Atomics.load(mem, Offset.Index) >= length) {
        break
      }
    }

    Atomics.store(mem, Offset.WakeAllFuzzers, 0)
    console.log(cs)
  }
}

onmessage = event => {
  main(new Int32Array(event.data.sab), event.data.concurrency)
}
