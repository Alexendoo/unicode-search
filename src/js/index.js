/* eslint-env browser */
'use strict'
import 'core-js/es6/promise'
import 'core-js/fn/array/from'
import 'core-js/fn/string/code-point-at'
import 'core-js/fn/string/from-code-point'
import 'core-js/fn/string/includes'
import 'core-js/fn/symbol'
import 'core-js/fn/symbol/iterator'
import 'whatwg-fetch'
import Buffer from 'buffer'
import TemplatePolyfill from 'template-polyfill'

TemplatePolyfill()

const input = document.getElementById('chars')
const template = document.getElementById('char--template')
const display = document.querySelector('main')

let names
fetch('names.json')
  .then(response => response.json())
  .then(json => { names = json })
  .then(() => updateUi())

let blocks
fetch('blocks.json')
  .then(response => response.json())
  .then(json => { blocks = json })
  .then(() => updateUi())

input.addEventListener('input', () => updateUi())

const populators = {

  chars (limit = 50, override) {
    const inputValue = override || input.value
    let count = 0
    for (let char of inputValue) {
      if (++count > limit) {
        insertLoadMore()
        return
      }
      const details = createCharDetails(char, template)
      display.appendChild(details)
    }
  },

  name (limit = 10) {
    const inputValue = input.value.toUpperCase()
    if (!inputValue || !names) return

    let count = 0
    for (let codepoint in names) {
      const name = names[codepoint]
      if (name.includes(inputValue)) {
        if (++count > limit) {
          insertLoadMore()
          return
        }
        const details = createCharDetails(String.fromCodePoint(codepoint), template)
        display.appendChild(details)
      }
    }
  },

  bytes (limit = 50) {
    const inputValue = input.value.replace(/\s/g, '')
    if (!/^[0-9a-f]{2,}$/i.test(inputValue)) {
      return
    }

    const bytes = new Buffer.Buffer(
      inputValue
        .match(/../g)
        .map(byte => parseInt(byte, 16))
    )

    populators.chars(limit, bytes.toString())
  }

}
let populator = populators.chars

for (const radio of document.querySelectorAll('input[name=type]')) {
  radio.addEventListener('change', event => {
    populator = populators[event.target.value]
    updateUi()
  })
}

const worker = new Worker('worker.js')

worker.postMessage('hello!')

worker.onmessage = function (message) {
  console.log('browser:', message.data)
}

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('sw.js')
}

function updateUi (limit) {
  clearChildren(display)
  worker.postMessage({
    input: input.value,
    type: populator.name
  })
  populator(limit)
}

function insertLoadMore () {
  const button = document.createElement('button')
  button.textContent = 'load more'
  button.className = 'load-more'
  button.addEventListener('click', () => updateUi(1000), true)
  display.appendChild(button)
}

function createCharDetails (char, template) {
  const code = char.codePointAt()
  const name = (names) ? names[code] || 'Unknown' : 'Loading...'
  const block = getBlock(char, blocks)
  const bytes = [...new Buffer.Buffer(char)]
    .map(bytes => bytes.toString(16).toUpperCase())
    .join(' ')

  template.content.querySelector('.char--literal').textContent = char
  template.content.querySelector('.char--name').textContent = name
  template.content.querySelector('.char--block').textContent = block
  template.content.querySelector('.char--code').textContent = code
  template.content.querySelector('.char--bytes').textContent = bytes

  return document.importNode(template.content, true)
}

function getBlock (char, blocks) {
  if (!blocks) return 'Loading...'
  const code = char.codePointAt()

  for (let block of blocks) {
    if (code >= block.start && code <= block.end) return block.name
  }

  return 'Unknown'
}

function clearChildren (node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
  return node
}
