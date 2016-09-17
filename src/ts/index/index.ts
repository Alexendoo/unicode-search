/// <reference path="../../../node_modules/typescript/lib/lib.es6.d.ts" />

import {
  BrowserMessage,
  InputMessage,
  ClearMessage,
  DisplayMessage,
  InputType
} from '../messages'

import TemplatePolyfill from 'template-polyfill'
TemplatePolyfill()

const input = document.getElementById('chars') as HTMLInputElement
const template = document.getElementById('char--template') as HTMLTemplateElement
const display = document.querySelector('main')
const radios = document.querySelectorAll('input[name=type]') as NodeListOf<HTMLInputElement>
let type: InputType = 'chars'

input.addEventListener('input', () => updateUi())

for (let i = 0; i < radios.length; i++) {
  const radio = radios[i]

  radio.addEventListener('change', event => {
    type = (event.target as HTMLInputElement).value as InputType
    updateUi()
  })
}

const worker = new Worker('worker.js')

worker.onmessage = function ({data: message}: { data: BrowserMessage }) {
  console.log('💻', message)
  if (isClear(message)) {
    return clearChildren(display)
  }
  if (isDisplay(message)) {
    return createCharDetails(message)
  }
}

function isClear(message: BrowserMessage): message is ClearMessage {
  return message.action === 'clear'
}

function isDisplay(message: BrowserMessage): message is DisplayMessage {
  return message.action === 'display'
}

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('sw.js')
}

function updateUi() {
  let text: string
  if (input.value.length > 100) {
    text = input.value.slice(0, 100)
  } else {
    text = input.value
  }

  const message: InputMessage = {
    action: 'input',
    type: type,
    input: text
  }

  worker.postMessage(message)
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

setInterval(function() {
  if (!input.value) return
  worker.postMessage({ action: 'tick' })
}, 100)
