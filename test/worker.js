/* eslint-env worker */

onmessage = function (message) {
  console.log('recieved')
  for (var i = 0; i <= 50000000; i++) {
    var moo = Math.random()
    moo + 1
  }
  console.log('processed')
}
