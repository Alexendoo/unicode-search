/// <reference path="../../../node_modules/typescript/lib/lib.d.ts" />

import {
  BrowserMessage,
  InputMessage,
  ClearMessage,
  DisplayMessage,
  TickMessage,
  InputType
} from '../messages'

import TemplatePolyfill from 'template-polyfill'
TemplatePolyfill()

const input = document.getElementById('chars') as HTMLInputElement
const template = document.getElementById('char--template') as HTMLTemplateElement
const display = document.querySelector('main')
const radios = document.querySelectorAll('input[name=type]') as NodeListOf<HTMLInputElement>
let type: InputType = 'chars'

input.addEventListener('input', () => sendInput())

for (let i = 0; i < radios.length; i++) {
  const radio = radios[i]

  radio.addEventListener('change', event => {
    type = (event.target as HTMLInputElement).value as InputType
    sendInput()
  })
}

const worker = new Worker('worker.js')
sendInput()

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('sw.js')
// }

worker.onmessage = function({data: message}: { data: BrowserMessage }) {
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

document.addEventListener('scroll', () => {
  if (needsEntries()) sendTick()
}, {passive: true})

function isClear(message: BrowserMessage): message is ClearMessage {
  return message.action === 'clear'
}

function isDisplay(message: BrowserMessage): message is DisplayMessage {
  return message.action === 'display'
}

function needsEntries(): boolean {
  return (document.body.clientHeight - (window.innerHeight + window.scrollY) < 1000)
}

function sendInput() {
  const message: InputMessage = {
    action: 'input',
    type: type,
    input: input.value
  }

  worker.postMessage(message)
  if (needsEntries()) sendTick()
}

function sendTick() {
  worker.postMessage({action: 'tick'} as TickMessage)
}

function createCharDetails({character, name, block, codePoint, bytes}: DisplayMessage) {
  template.content.querySelector('.char--literal').textContent = character
  template.content.querySelector('.char--name').textContent = name
  template.content.querySelector('.char--block').textContent = block
  template.content.querySelector('.char--code').textContent = String(codePoint)
  template.content.querySelector('.char--bytes').textContent = bytes

  const node = document.importNode(template.content, true)
  display.appendChild(node)
}

function clearChildren(node: Node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}
