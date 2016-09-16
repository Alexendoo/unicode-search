/// <reference path="../../node_modules/typescript/lib/lib.webworker.d.ts" />

'use strict'

import * as Messages from './messages'
import { clear, initialise } from './initialiser'
import * as Util from './util'

let names
let blocks

loadData()

let input: string
let type: Messages.InputType

// TODO: track recieved and requested № entries in main thread

onmessage = function ({data}: {data: Messages.Message}) {
  switch (data.action) {
    case 'input':
      receiveInput(data as Messages.InputMessage)
      break
    case 'tick':
      receiveTick(data as Messages.TickMessage)
      break
  }
}

function receiveInput (data: Messages.InputMessage) {
  if (!data.type) return
  if (type !== data.type) {
    Util.log('Δ type:', type, '→', data.type)
    type = data.type
    clear(type)
  }
  if (!data.input) {
    clear(type)
    return
  }

  input = data.input

  initialise(input, type)

}

// let timeoutID
// function scheduleTimer () {
//   clearTimeout(timeoutID)
//   timeoutID = setTimeout(tick, 1000)
// }

function receiveTick (data: Messages.TickMessage) {
  Util.log('tick', data)
}

function send (message) {
  self.postMessage({action: 'append', type, message})
}

function loadData() {
  const nameRequest = new XMLHttpRequest()
  nameRequest.onreadystatechange = function() {
    if (nameRequest.readyState === XMLHttpRequest.DONE && nameRequest.status === 200) {
      names = JSON.parse(nameRequest.responseText)
    }
  }
  nameRequest.open('GET', 'names.json')
  nameRequest.send()

  const blockRequest = new XMLHttpRequest()
  blockRequest.onreadystatechange = function() {
    if (blockRequest.readyState === XMLHttpRequest.DONE && blockRequest.status === 200) {
      blocks = JSON.parse(blockRequest.responseText)
    }
  }
  blockRequest.open('GET', 'blocks.json')
  blockRequest.send()
}