export interface Tagged {
  tag: number
}

export interface InputMessage extends Tagged {
  input: string
}

export interface CharMessage extends Tagged {
  codepoint: number
  name: string
}
