// Adapted from Section 6 Mutex, Take 3
// https://www.akkadia.org/drepper/futex.pdf

const enum State {
  Unlocked = 0,
  Locked = 1,
  LockedWaiters = 2, // Locked with one or more waiters
}

export function lock(mem: Int32Array, idx: number) {
  let c = Atomics.compareExchange(mem, idx, State.Unlocked, State.Locked)
  if (c !== State.Unlocked) {
    if (c !== 2) {
      c = Atomics.exchange(mem, idx, State.LockedWaiters)
    }

    while (c !== 0) {
      Atomics.wait(mem, idx, State.LockedWaiters)
      c = Atomics.exchange(mem, idx, State.LockedWaiters)
    }
  }
}

export function unlock(mem: Int32Array, idx: number) {
  if (Atomics.sub(mem, idx, 1) !== State.Locked) {
    Atomics.store(mem, idx, State.Unlocked)
    Atomics.wake(mem, idx, 1)
  }
}
