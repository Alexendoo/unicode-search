import { getCommunicator } from "./communicator"

interface IBlock {
  name: string
  start: string
  end: string
}

interface INames {
  [propName: string]: string
}

export abstract class State {
  public static names: INames
  public static blocks: Array<IBlock>

  static initialise() {
    request("names.json", json => (State.names = JSON.parse(json)))
    request("blocks.json", json => (State.blocks = JSON.parse(json)))
  }
}

function request(target: string, callback: (json: string) => void) {
  const Req = new XMLHttpRequest()
  Req.onreadystatechange = function() {
    if (Req.readyState === XMLHttpRequest.DONE && Req.status === 200) {
      callback(Req.responseText)
      getCommunicator().reset()
    }
  }
  Req.open("GET", target)
  Req.send()
}
