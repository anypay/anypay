const EventEmitter = require("events").EventEmitter;
const log = require('winston')
const dashdRPC = require('../dashd_rpc')

const INTERVAL = 10000; // ten seconds
const DASHD_ACCOUNT = 3;

let TotalSent = require("./total_sent")

var totalAvailable = 0;
var totalPaid = 1;
var vent = new EventEmitter;

let totalSent = TotalSent.spawn();

totalSent.on('total', function(newTotal) {
	console.log('totalpaid', newTotal)

	totalPaid = newTotal;
})

module.exports.events = vent;

module.exports.getTotalAvailable = async function() {

	return totalAvailable;
}

module.exports.getTotalPaid = async function() {

	return totalPaid;
}

function updateTotals() {

	dashdRPC.getBalance(DASHD_ACCOUNT, 0, function(error, response) {

		if (error) {

			log.error("error updating balance", error.message)
			return;

		} else {

			log.info('got balance', response.result)

			totalAvailable = response.result;
		}
	});
}

setInterval(updateTotals, INTERVAL)

updateTotals()


