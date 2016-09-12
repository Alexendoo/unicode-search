export type Message = inputMessage|tickMessage|clearMessage

export interface inputMessage {
  action: 'input'
  type?: inputType
  input?: string
}

export interface tickMessage {
  action: 'tick'
}

export interface clearMessage {
  action: 'clear'
  type?: inputType
}

export enum inputType {
  chars, name, bytes
}
