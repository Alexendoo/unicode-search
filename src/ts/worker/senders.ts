/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { ClearMessage, DisplayMessage, InputType } from '../messages'
import { State } from './state'
import { stringToUtf8ByteArray } from '../util'

export function sendClear(type: InputType) {
  const message: ClearMessage = {
    action: 'clear',
    type
  }

  self.postMessage(message)
}

export function sendCharacter(input: string) {
  const codePoint = input.codePointAt(0)

  const block = getBlock(codePoint)
  const bytes = getBytes(input)
  const character = input
  const name = (State.names) ? State.names[codePoint] || 'Unknown' : 'Loading…'

  const message: DisplayMessage = {
    action: 'display',
    block,
    bytes,
    character,
    codePoint,
    name
  }

  self.postMessage(message)
}

function getBlock(codePoint: number): string {
  if (!State.blocks) return 'Loading…'

  for (const block of State.blocks) {
    if (codePoint >= Number(block.start) && codePoint <= Number(block.end)) return block.name
  }

  return 'Unknown'
}

function getBytes(input: string): string {
  return stringToUtf8ByteArray(input)
    .map(byte => byte.toString(16))
    .map(byte => byte.length < 2 ? '0' + byte : byte)
    .join(' ')
}
