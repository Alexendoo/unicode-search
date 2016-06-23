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

input.addEventListener('input', updateUi)

function updateUi () {
  clearChildren(display)

  for (const char of input.value) {
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
  const code = char.charCodeAt().toString(16).toUpperCase()
  const name = (names) ? names[code] || 'Unknown' : 'Loading...'
  const bytes = [...new TextEncoder().encode(char)]
    .map(bytes => bytes.toString(16).toUpperCase())
    .join(' ')

  template.content.querySelector('.char--literal').textContent = char
  template.content.querySelector('.char--name').textContent = name
  template.content.querySelector('.char--code').textContent = code
  template.content.querySelector('.char--bytes').textContent = bytes

  return document.importNode(template.content, true)
}
