import { Offset } from "../shared/memory"
import { length, names } from "../data/names"
import { unlock } from "../shared/mutex";

function main(mem: Int32Array, concurrency: number) {
  let turn = 0
  while (true) {
    Atomics.wait(mem, Offset.Turn, turn)
    turn = Atomics.load(mem, Offset.Turn)

    const rec: number[] = []

    while (true) {
      if (Atomics.load(mem, Offset.Turn) !== turn) {
        break
      }

      Atomics.wait(mem, Offset.Coordinator, 0)

      const codepoint = Atomics.load(mem, Offset.Codepoint)
      rec.push(codepoint)

      unlock(mem, Offset.Mutex)
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
