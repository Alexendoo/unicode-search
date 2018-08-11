import { Offset, CoordinatorState, FuzzerState } from "../shared/memory"
import { length } from "../data/names"

function main(mem: Int32Array, concurrency: number) {
  let turn = 0
  while (true) {
    Atomics.wait(mem, Offset.Turn, turn)
    turn = Atomics.load(mem, Offset.Turn)

    const rec = []

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      Atomics.wait(mem, Offset.Coordinator, CoordinatorState.Idle)
      Atomics.store(mem, Offset.Coordinator, CoordinatorState.Scanning)

      for (
        let i = Offset.InputEnd;
        i < Offset.InputEnd + concurrency * Offset.ResultEnd;
        i += Offset.ResultEnd
      ) {
        if (Atomics.load(mem, i + Offset.Fuzzer) === FuzzerState.Fuzzing) {
          continue
        }

        const codepoint = Atomics.load(mem, i + Offset.Codepoint)
        rec.push(codepoint)

        Atomics.store(mem, i + Offset.Fuzzer, FuzzerState.Fuzzing)
        Atomics.wake(mem, i + Offset.Fuzzer, 1)
      }

      const prev = Atomics.compareExchange(
        mem,
        Offset.Coordinator,
        CoordinatorState.Scanning,
        CoordinatorState.Idle,
      )

      if (prev === CoordinatorState.HasResult) {
        continue
      }

      if (Atomics.load(mem, Offset.Index) >= length) {
        break
      }
    }

    console.log(rec)
    // TODO: some entries getting eaten
    console.assert(rec.length === length)
  }
}

onmessage = event => {
  main(new Int32Array(event.data.sab), event.data.concurrency)
}
