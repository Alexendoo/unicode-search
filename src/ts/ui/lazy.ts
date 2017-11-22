import { CharMessage } from "../worker/messages"
import { charElement } from "./char"
import { app } from "./dom"

export const sab = new SharedArrayBuffer(2 * Uint32Array.BYTES_PER_ELEMENT)
const tagMemory = new Uint32Array(sab, 0, 1)
const countMemory = new Int32Array(sab, 4, 1)

const CHARS_PER_RTT = 20

let received = 0

const observer = new IntersectionObserver(intersectionCallback, {
  rootMargin: "1080px",
})

function intersectionCallback(
  entries: IntersectionObserverEntry[],
  observer: IntersectionObserver,
) {
  entries = entries.filter(entry => entry.isIntersecting)

  if (entries.length === 0) return

  Atomics.add(countMemory, 0, CHARS_PER_RTT)
  Atomics.wake(countMemory, 0, Infinity)

  entries.forEach(entry => observer.unobserve(entry.target))
}

export function receiveChar(message: CharMessage) {
  if (message.tag !== Atomics.load(tagMemory, 0)) {
    return
  }

  const char = charElement(message)

  received += 1

  if (received === Atomics.load(countMemory, 0)) {
    observer.observe(char.firstChild as Element)
  }

  app.appendChild(char)
}

export function newTag() {
  const oldTag = Atomics.add(tagMemory, 0, 1)

  received = 0

  Atomics.store(countMemory, 0, CHARS_PER_RTT)
  Atomics.wake(countMemory, 0, Infinity)

  return oldTag + 1
}
