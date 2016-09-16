/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import * as Messages from '../messages'
import Initialiser from './initialiser'
import * as Util from '../util'
import { State } from './state'

State.initialise()

const initialiser = new Initialiser()

// TODO: track recieved and requested № entries in main thread

onmessage = function ({data}: {data: Messages.Message}) {
  switch (data.action) {
    case 'input':
      receiveInput(data as Messages.InputMessage)
      break
    case 'tick':
      receiveTick(data as Messages.TickMessage)
      break
  }
}

function receiveInput (data: Messages.InputMessage) {
  initialiser.initialise(data.input, data.type)
}

// let timeoutID
// function scheduleTimer () {
//   clearTimeout(timeoutID)
//   timeoutID = setTimeout(tick, 1000)
// }

function receiveTick (data: Messages.TickMessage) {
  Util.log('tick', data)
}

function send (message) {
  self.postMessage({action: 'append', type, message})
}
