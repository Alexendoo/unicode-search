export type Message = InputMessage | TickMessage
export type InputType = 'bytes' | 'chars' | 'name'

export interface InputMessage {
  action: 'input'
  type?: InputType
  input?: string
}

export interface TickMessage {
  action: 'tick'
}

export interface ClearMessage {
  action: 'clear'
  type?: InputType
}
