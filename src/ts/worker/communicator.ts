/// <reference path="../../../node_modules/typescript/lib/lib.webworker.d.ts" />

import { InputType, InputMessage } from '../messages'
import { arrayStartsWith, log } from '../util'
import { State } from './state'
import { CharCache } from './caches'
import { sendClear } from './senders'


let lastType: InputType
let mCommunicator: Communicator
export function getCommunicator(type: InputType): Communicator {
  if (type === lastType) return mCommunicator
  switch (type) {
    case 'bytes':
      mCommunicator = new BytesCommunicator(type)
      break
    case 'chars':
      mCommunicator = new CharsCommunicator(type)
      break
    case 'name':
      mCommunicator = new NameCommunicator(type)
      break
  }
  return mCommunicator
}

abstract class Communicator {
  protected input: string
  protected sendClear = sendClear
  protected type: InputType

  constructor(type: InputType) {
    this.type = type
  }

  receive(message: InputMessage) {
    this.input = message.input
  }
}

class BytesCommunicator extends Communicator {
}

class CharsCommunicator extends Communicator {
  private Cache: CharCache

  constructor(type: InputType) {
    super(type)
    this.Cache = new CharCache()
  }

  receive(message: InputMessage) {
    super.receive(message)
    const invalidated = this.Cache.update(this.input)
    if (invalidated) this.sendClear(this.type)
  }
}

class NameCommunicator extends Communicator {
}
