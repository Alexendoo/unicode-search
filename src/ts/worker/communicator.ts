import { InputType } from "../messages"
import { ICache, ByteCache, CharCache, NameCache } from "./caches"
import { sendClear, sendCharacter } from "./senders"

let mCommunicator: ICommunicator

/**
 * Returns an ICommunicator, recreating it if the InputType
 * changes
 *
 * @param [type] the currently selected type by the user
 * @returns an ICommunicator to send/receieve input to the
 *          browser
 */
export function getCommunicator(type?: InputType): ICommunicator {
  if (mCommunicator && mCommunicator.type === type) return mCommunicator
  switch (type) {
    case "bytes":
      mCommunicator = new Communicator(ByteCache, type)
      break
    case "chars":
      mCommunicator = new Communicator(CharCache, type)
      break
    case "name":
      mCommunicator = new Communicator(NameCache, type)
      break
  }
  return mCommunicator
}

interface ICommunicator {
  /**
   * InputType the ICommunicator was initialised with
   */
  type: InputType

  /**
   * Receive new input from the user, updates the Cache
   * as needed
   *
   * @param input user supplied input
   */
  receive(input: string): void

  /**
   * Reset the cache and sendClear to the browser
   */
  reset(): void

  /**
   * Send the next character to the browser
   */
  send(): void
}

class Communicator<T extends ICache> implements ICommunicator {
  public type: InputType

  private Cache: T
  private CacheType: new () => T
  private input: string

  constructor(CacheType: new () => T, type: InputType) {
    this.type = type

    this.Cache = new CacheType()
    this.CacheType = CacheType
  }

  receive(input: string) {
    this.input = input
    const invalidated = this.Cache.update(input)
    if (invalidated) sendClear()
  }

  reset() {
    this.Cache = new this.CacheType()
    this.receive(this.input)
    sendClear()
  }

  send() {
    sendCharacter(this.Cache.next())
  }
}
