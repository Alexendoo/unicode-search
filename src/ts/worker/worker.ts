/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { InputMessage, TickMessage, WorkerMessage } from '../messages'
import { State } from './state'
import { getCommunicator } from './communicator'

State.initialise()

onmessage = function ({data: message}: { data: WorkerMessage }) {
  if (isInput(message)) {
    return getCommunicator(message.type)
      .receive(message)
  }
  if (isTick(message)) {
    return getCommunicator()
      .send()
  }
}

function isInput(message: WorkerMessage): message is InputMessage {
  return message.action === 'input'
}

function isTick(message: WorkerMessage): message is TickMessage {
  return message.action === 'tick'
}
