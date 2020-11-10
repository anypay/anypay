
var EventSource = require('eventsource')

var es2 = new EventSource('http://localhost:8020/sse/r/s2T28FL-W')
es2.addEventListener('paid', function (e) {
  console.log(e.data)
})
