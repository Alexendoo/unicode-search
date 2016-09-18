/* eslint-env browser */

var worker = new Worker('worker.js')

console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
console.log('sending')
worker.postMessage('message')
