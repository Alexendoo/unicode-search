import { getCommunicator } from "./communicator"

interface IBlock {
  name: string
  start: number
  end: number
}

interface INames {
  [propName: string]: string
}

export abstract class State {
  public static names: INames
  public static blocks: Array<IBlock>

  static initialise() {
    import("../../data/blocks").then(blocks => {
      State.blocks = blocks.default
    })

    import("../../data/names").then(names => {
      State.names = names.default
    })
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
