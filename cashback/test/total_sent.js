
let TotalSent = require("../lib/dash/total_sent")

let totalSent = TotalSent.spawn();

totalSent.on('total', function(newTotal) {

	console.log('a new total!', newTotal)
})

