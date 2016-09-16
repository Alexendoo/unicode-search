export type WorkerMessage = InputMessage | TickMessage
export type BrowserMessage = ClearMessage | DisplayMessage

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

export interface DisplayMessage {
  action: 'display'
  character: string
  name: string
  block: string
  codePoint: number
  bytes: string
}