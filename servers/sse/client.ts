
var EventSource = require('eventsource')

var es2 = new EventSource('https://api.anypayinc.com/sse/r/s2T28FL-W')

es2.addEventListener('paid', function (e) {

  console.log(e.data)

})
