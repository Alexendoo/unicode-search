/* eslint-env worker */

import 'whatwg-fetch'

let names
fetch('names.json')
  .then(response => response.json())
  .then(json => { names = json })
  .then(updateUi)

let blocks
fetch('blocks.json')
  .then(response => response.json())
  .then(json => { blocks = json })
  .then(updateUi)

let input
let type

const iterators = {
  cache: undefined,
  chars () {
    log('chars()', input)
    sendElement(input)
  }
}
let iterator

onmessage = function ({data}) {
  if (!data.type) return
  if (type !== data.type) {
    log('Δ type:', type, '→', data.type)
    type = data.type
    clear()
  }

  iterator = iterators[type]
  input = data.input
  updateUi()
}

function updateUi () {
  iterator()
}

function clear () {
  iterators.cache = undefined
  self.postMessage({action: 'clear', type})
}

function sendElement (message) {
  self.postMessage({action: 'append', type, message})
}

function log (...v) {
  if (console && console.log) console.log('⚙', ...v)
}
