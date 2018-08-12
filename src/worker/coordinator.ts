import { Offset, CoordinatorState, FuzzerState } from "../shared/memory"
import { length, names } from "../data/names"

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
        let outIndex = Offset.InputEnd;
        outIndex < Offset.InputEnd + concurrency * Offset.ResultEnd;
        outIndex += Offset.ResultEnd
      ) {
        if (
          Atomics.load(mem, outIndex + Offset.Fuzzer) === FuzzerState.Fuzzing
        ) {
          continue
        }

        const codepoint = Atomics.load(mem, outIndex + Offset.Codepoint)
        rec.push(codepoint)

        Atomics.store(mem, outIndex + Offset.Fuzzer, FuzzerState.Fuzzing)
        Atomics.wake(mem, outIndex + Offset.Fuzzer, 1)
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

    console.log("rec", rec)

    const sorted = rec.slice().sort((a, b) => a - b)
    const duplicates = []
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i] === sorted[i + 1]) {
        duplicates.push(sorted[i])
      }
    }
    console.log("duplicates", duplicates)

    const actual = new Set(sorted)
    const missing = names.filter(name => !actual.has(name.codepoint))
    console.log("missing", missing)
  }
}

onmessage = event => {
  main(new Int32Array(event.data.sab), event.data.concurrency)
}
