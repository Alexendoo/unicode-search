import "../../files"
import { InputMessage, CharMessage } from "../worker/messages"
import { charElement } from "./char"
import { clearNode, input, app } from "./dom"
import { sab, newTag, receiveChar } from "./lazy"

const worker = new Worker("worker.js")
worker.postMessage(sab)

function sendMessage() {
  const message: InputMessage = {
    input: input.value.toUpperCase(),
    tag: newTag(),
  }

  worker.postMessage(message)
  clearNode(app)
}

function receiveMessage(event: MessageEvent) {
  const message: CharMessage = event.data

  receiveChar(message)
}

worker.addEventListener("message", receiveMessage)
input.addEventListener("input", sendMessage)

declare global {
  interface Window {
    [key: string]: any
  }
}

window.worker = worker
