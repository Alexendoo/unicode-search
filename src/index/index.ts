import {
  BrowserMessage,
  InputMessage,
  ClearMessage,
  DisplayMessage,
  TickMessage,
  InputType,
} from "../shared/messages"

import "../css/app.css"
import { Offset } from "../shared/memory"

const input = document.getElementById("chars") as HTMLInputElement
const template = document.getElementById(
  "char--template",
) as HTMLTemplateElement
const display = document.querySelector("main") as HTMLMainElement
const radios = document.querySelectorAll("input[name=type]") as NodeListOf<
  HTMLInputElement
>
let type: InputType

// input.addEventListener("input", () => sendInput())

// for (let i = 0; i < radios.length; i++) {
//   const radio = radios[i]

//   if (radio.checked) type = radio.value as InputType

//   radio.addEventListener("change", event => {
//     type = (event.target as HTMLInputElement).value as InputType
//     sendInput()
//   })
// }

// const concurrency = navigator.hardwareConcurrency
const concurrency = 1
const sab = new SharedArrayBuffer(4 * Offset.InputEnd)
;(window as any).mem = new Int32Array(sab)

const fuzzers = new Set()
let loaded = 0

const coordinator = new Worker("coordinator.js")

console.group("Loading Workers")
for (let pid = 1; pid <= concurrency; pid++) {
  const fuzzer = new Worker("fuzzy.js")

  fuzzer.postMessage({ sab, pid })
  fuzzer.onmessage = () => {
    console.log(`Loaded pid ${pid} (${loaded + 1}/${concurrency})`)
    if (++loaded === concurrency) {
      coordinator.postMessage({ sab, concurrency })
      console.groupEnd()
    }
  }
  fuzzers.add(fuzzer)
}

// sendInput()

// coordinator.onmessage = function({ data: message }: { data: BrowserMessage }) {
//   if (isClear(message)) {
//     clearChildren(display)
//     sendTick()
//     return
//   }
//   if (isDisplay(message)) {
//     createCharDetails(message)
//     if (needsEntries()) sendTick()
//     return
//   }
// }

// document.addEventListener("scroll", () => {
//   if (needsEntries()) sendTick()
// })

// function isClear(message: BrowserMessage): message is ClearMessage {
//   return message.action === "clear"
// }

// function isDisplay(message: BrowserMessage): message is DisplayMessage {
//   return message.action === "display"
// }

// function needsEntries(): boolean {
//   return (
//     document.body.clientHeight - (window.innerHeight + window.pageYOffset) <
//     1000
//   )
// }

// function sendInput() {
//   const message: InputMessage = {
//     action: "input",
//     type: type,
//     input: input.value,
//   }

//   coordinator.postMessage(message)
//   if (needsEntries()) sendTick()
// }

// function sendTick() {
//   coordinator.postMessage({ action: "tick" } as TickMessage)
// }

// function createCharDetails({
//   character,
//   name,
//   block,
//   codePoint,
//   bytes,
// }: DisplayMessage) {
//   template.content.querySelector(".char--literal")!.textContent = character
//   template.content.querySelector(".char--name")!.textContent = name
//   template.content.querySelector(".char--block")!.textContent = block
//   template.content.querySelector(".char--code")!.textContent = String(codePoint)
//   template.content.querySelector(".char--bytes")!.textContent = bytes

//   const node = document.importNode(template.content, true)
//   display.appendChild(node)
// }

// function clearChildren(node: Node) {
//   while (node.firstChild) {
//     node.removeChild(node.firstChild)
//   }
// }
