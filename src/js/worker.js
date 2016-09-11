/* eslint-env worker */

import 'whatwg-fetch'

let names
fetch('names.json')
  .then(response => response.json())
  .then(json => { names = json })
  .then(sendClear)

let blocks
fetch('blocks.json')
  .then(response => response.json())
  .then(json => { blocks = json })
  .then(sendClear)

onmessage = function (message) {
  console.log('worker', message.data)
}

function sendClear () {
  self.postMessage('hello')
}
