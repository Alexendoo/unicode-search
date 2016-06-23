/* eslint-env browser */
'use strict'

const input = document.getElementById('chars')
const display = document.querySelector('main')
let names

fetch('/json/names.json')
  .then(response => response.json())
  .then(json => { names = json })

input.addEventListener('input', event => {
  display.textContent = null
  for (const char of input.value) {
    const code = char.charCodeAt().toString(16).toUpperCase()
    const name = names[code]
    const bytes = [...new TextEncoder().encode(char)]
      .map(bytes => bytes.toString(16).toUpperCase())
      .join(' ')

    display.textContent += `${char} - ${code} - ${name} - ${bytes} | `
  }
})

console.log(input)
