/* eslint-env browser */
'use strict'

const input = document.getElementById('chars')
const template = document.getElementById('char--template')
const display = document.querySelector('main')
let names

fetch('/json/names.json')
  .then(response => response.json())
  .then(json => { names = json })

input.addEventListener('input', event => {
  clearChildren(display)

  for (const char of input.value) {
    const details = createCharDetails(char, template)

    display.appendChild(details)
  }
})

/**
 * Remove all child nodes from a node
 *
 * @param  {Node} node to remove children from
 *
 * @return {Node} resulting node
 */
function clearChildren (node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild)
  }
  return node
}

function createCharDetails (char, template) {
  const code = char.charCodeAt().toString(16).toUpperCase()
  const name = names[code]
  const bytes = [...new TextEncoder().encode(char)]
    .map(bytes => bytes.toString(16).toUpperCase())
    .join(' ')

  template.content.querySelector('.char--literal').textContent = char
  template.content.querySelector('.char--name').textContent = name
  template.content.querySelector('.char--code').textContent = code
  template.content.querySelector('.char--bytes').textContent = bytes

  return document.importNode(template.content, true)
}
