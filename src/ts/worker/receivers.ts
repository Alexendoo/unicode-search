import { InputMessage, TickMessage } from '../messages'
import Initialiser from './initialiser'
import { log } from '../util'

const initialiser = new Initialiser()

export function receiveInput(message: InputMessage) {
  initialiser.initialise(message.input, message.type)
}

export function receiveTick(message: TickMessage) {
  log('tick', message)
}
