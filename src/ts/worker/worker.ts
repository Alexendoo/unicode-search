/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import * as Messages from '../messages'
import { State } from './state'
import { receiveInput, receiveTick } from './receivers'

State.initialise()

// TODO: track recieved and requested № entries in main thread

onmessage = function ({data}: { data: Messages.Message }) {
  switch (data.action) {
    case 'input':
      receiveInput(data as Messages.InputMessage)
      break
    case 'tick':
      receiveTick(data as Messages.TickMessage)
      break
  }
}
