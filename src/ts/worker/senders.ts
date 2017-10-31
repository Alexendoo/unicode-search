import { ClearMessage, DisplayMessage } from "../messages"
import { State } from "./state"
import { charToCodePoint, stringToUtf8ByteArray } from "../util"

export function sendClear() {
  const message: ClearMessage = {
    action: "clear",
  }

  postMessage(message)
}

export function sendCharacter(input?: string) {
  if (input === undefined) {
    // TODO sendDone()
    return
  }
  const codePoint = charToCodePoint(input)

  const block = getBlock(codePoint)
  const bytes = getBytes(input)
  const character = input
  const name = State.names ? State.names[codePoint] || "Unknown" : "Loading…"

  const message: DisplayMessage = {
    action: "display",
    block: block,
    bytes: bytes,
    character: character,
    codePoint: codePoint,
    name: name,
  }

  postMessage(message)
}

function getBlock(codePoint: number): string {
  if (!State.blocks) return "Loading…"

  for (const block of State.blocks) {
    if (codePoint >= Number(block.start) && codePoint <= Number(block.end))
      return block.name
  }

  return "Unknown"
}

function getBytes(input: string): string {
  return stringToUtf8ByteArray(input)
    .map(byte => byte.toString(16).toUpperCase())
    .map(byte => (byte.length < 2 ? "0" + byte : byte))
    .join(" ")
}