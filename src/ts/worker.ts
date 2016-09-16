/* eslint-env worker */
/// <reference path="../../node_modules/typescript/lib/lib.webworker.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es7.d.ts" />
/// <reference path="../../node_modules/typescript/lib/lib.es6.d.ts" />

'use strict'

import * as Messages from './messages'

let names
let blocks

loadData()

let input: string
let type: Messages.InputType

// TODO: track recieved and requested № entries in main thread

let cache
const initialisers = {

  chars () {
    const chars = Array.from(input)
    if (cache === undefined) {
      cache = {
        part: chars,
        full: chars
      }
    } else if (arrayStartsWith(chars, cache.full)) {
      const len = cache.full.length
      cache.part.push(...chars.slice(len))
      cache.full = chars
    } else {
      clear()
      cache = {
        part: chars,
        full: chars
      }
    }

    log('init chars', 'part', cache.part, 'full', cache.full)
  },

  name () {},

  bytes () {}

}

onmessage = function ({data}: {data: Messages.Message}) {
  switch (data.action) {
    case 'input':
      receiveInput(<Messages.InputMessage>data)
      break
    case 'tick':
      receiveTick(<Messages.TickMessage>data)
      break
  }
}

function receiveInput (data: Messages.InputMessage) {
  if (!data.type) return
  if (type !== data.type) {
    log('Δ type:', type, '→', data.type)
    type = data.type
    clear()
  }
  if (!data.input) {
    clear()
    return
  }

  input = data.input

  initialise()
}

// let timeoutID
// function scheduleTimer () {
//   clearTimeout(timeoutID)
//   timeoutID = setTimeout(tick, 1000)
// }

function receiveTick (data) {
  log('tick', data.upto)
}

function initialise () {
  if (!type || !input) return
  initialisers[type]()
}

/**
 * Flush cache and clear main UI
 */
function clear () {
  cache = undefined
  self.postMessage({action: 'clear', type})
}

function send (message) {
  self.postMessage({action: 'append', type, message})
}

/**
 * e.g. [1,2,3] starts with [1,2]
 *
 * @param {any[]} long
 * @param {any[]} short
 * @returns if long starts with short
 */
function arrayStartsWith (long, short) {
  console.log(long, short)
  return short.every((v, i) => long[i] === v)
}

function log (...v) {
  if (console && console.log) console.log('⚙', ...v)
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