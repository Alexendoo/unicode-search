/* eslint-env browser */
'use strict'

const input = document.getElementById('chars')
const template = document.getElementById('char--template')
const display = document.querySelector('main')

let names
fetch('/json/names.json')
  .then(response => response.json())
  .then(json => { names = json })
  .then(updateUi)

let blocks
fetch('/json/blocks.json')
  .then(response => response.json())
  .then(json => { blocks = json })
  .then(updateUi)

input.addEventListener('input', updateUi)

if ('serviceWorker' in navigator) {
  // navigator.serviceWorker.register('sw.js').catch(console.log.bind(console))
}

function updateUi () {
  clearChildren(display)

  for (let char of input.value) {
    const details = createCharDetails(char, template)

    display.appendChild(details)
  }
}

function clearChildren (node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
}

function createCharDetails (char, template) {
  const code = char.codePointAt().toString(16).toUpperCase()
  const name = (names) ? names[code] || 'Unknown' : 'Loading...'
  const block = getBlock(char, blocks)
  const bytes = [...new TextEncoder().encode(char)]
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
