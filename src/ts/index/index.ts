import {
  BrowserMessage,
  InputMessage,
  ClearMessage,
  DisplayMessage,
  TickMessage,
  InputType,
} from "../messages"

import NameWorker from "worker-loader?name=[name].[hash].js!../worker/worker"
import "../../css/app.css"

const input = document.getElementById("chars") as HTMLInputElement
const template = document.getElementById(
  "char--template",
) as HTMLTemplateElement
const display = document.querySelector("main")
const radios = document.querySelectorAll("input[name=type]") as NodeListOf<
  HTMLInputElement
>
let type: InputType

polyfillTemplate(template)
input.addEventListener("input", () => sendInput())

for (let i = 0; i < radios.length; i++) {
  const radio = radios[i]

  if (radio.checked) type = radio.value as InputType

  radio.addEventListener("change", event => {
    type = (event.target as HTMLInputElement).value as InputType
    sendInput()
  })
}

console.log(NameWorker)
const worker = new NameWorker()
sendInput()

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('sw.js')
// }

worker.onmessage = function({ data: message }: { data: BrowserMessage }) {
  if (isClear(message)) {
    clearChildren(display)
    sendTick()
    return
  }
  if (isDisplay(message)) {
    createCharDetails(message)
    if (needsEntries()) sendTick()
    return
  }
}

document.addEventListener("scroll", () => {
  if (needsEntries()) sendTick()
})

function isClear(message: BrowserMessage): message is ClearMessage {
  return message.action === "clear"
}

function isDisplay(message: BrowserMessage): message is DisplayMessage {
  return message.action === "display"
}

function needsEntries(): boolean {
  return (
    document.body.clientHeight - (window.innerHeight + window.pageYOffset) <
    1000
  )
}

function sendInput() {
  const message: InputMessage = {
    action: "input",
    type: type,
    input: input.value,
  }

  worker.postMessage(message)
  if (needsEntries()) sendTick()
}

function sendTick() {
  worker.postMessage({ action: "tick" } as TickMessage)
}

function createCharDetails({
  character,
  name,
  block,
  codePoint,
  bytes,
}: DisplayMessage) {
  template.content.querySelector(".char--literal").textContent = character
  template.content.querySelector(".char--name").textContent = name
  template.content.querySelector(".char--block").textContent = block
  template.content.querySelector(".char--code").textContent = String(codePoint)
  template.content.querySelector(".char--bytes").textContent = bytes

  const node = document.importNode(template.content, true)
  display.appendChild(node)
}

function clearChildren(node: Node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

/**
 * Browsers that don't support template natively can be
 * made to with a little persuasion
 *
 * @param template to correct
 */
function polyfillTemplate(template: HTMLTemplateElement) {
  if ("content" in template) {
    return
  }

  const content = template.childNodes
  const fragment = document.createDocumentFragment()

  while (content[0]) {
    fragment.appendChild(content[0])
  }

  template.content! = fragment
}
