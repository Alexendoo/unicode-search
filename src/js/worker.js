/* eslint-env worker */
'use strict'

let names
fetch('names.json')
  .then(response => response.json())
  .then(json => { names = json })

let blocks
fetch('blocks.json')
  .then(response => response.json())
  .then(json => { blocks = json })

/** @type {String} */
let input
/** @type {String} */
let type

let cache
const initialisers = {

  chars () {
    const chars = [...input]
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

    log('initialisers.chars', cache, input)
  }

}

onmessage = function ({data}) {
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

function initialise () {
  if (!type || !input) return
  initialisers[type](input)
}

function clear () {
  cache = undefined
  self.postMessage({action: 'clear', type})
}

function sendElement (message) {
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
  return short.every((v, i) => long[i] === v)
}

function log (...v) {
  if (console && console.log) console.log('⚙', ...v)
}
