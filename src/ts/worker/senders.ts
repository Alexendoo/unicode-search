/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { ClearMessage, InputType } from '../messages'

export function sendClear(type: InputType) {
  const message: ClearMessage = {
    action: 'clear',
    type
  }

  self.postMessage(message)
}

export function sendCharacter() {

}