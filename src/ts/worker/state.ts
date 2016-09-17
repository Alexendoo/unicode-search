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
    const nameRequest = new XMLHttpRequest()
    nameRequest.onreadystatechange = function() {
      if (nameRequest.readyState === XMLHttpRequest.DONE && nameRequest.status === 200) {
        State.names = JSON.parse(nameRequest.responseText)
      }
    }
    nameRequest.open('GET', 'names.json')
    nameRequest.send()

    const blockRequest = new XMLHttpRequest()
    blockRequest.onreadystatechange = function() {
      if (blockRequest.readyState === XMLHttpRequest.DONE && blockRequest.status === 200) {
        State.blocks = JSON.parse(blockRequest.responseText)
      }
    }
    blockRequest.open('GET', 'blocks.json')
    blockRequest.send()
  }
}
