/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { ClearMessage, DisplayMessage, InputType } from '../messages'

export function sendClear(type: InputType) {
  const message: ClearMessage = {
    action: 'clear',
    type
  }

  self.postMessage(message)
}

export function sendCharacter(input: string) {
  const message: DisplayMessage = {
    action: 'display',
    block: 'one',
    bytes: 'AA',
    character: input,
    codePoint: 1,
    name: 'character'
  }

  self.postMessage(message)
}
