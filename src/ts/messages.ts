export type Message = InputMessage|TickMessage|ClearMessage

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

export enum InputType {
  chars, name, bytes
}
