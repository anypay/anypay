const EventEmitter = require('events').EventEmitter;

const dashRPC = require('../dashd_rpc')

class TotalSent extends EventEmitter {

	start() {
		this.total = 0;
		this.skip = 0;
		this.nextInterval = 1000; // start at one second interval

		setInterval(async () => {
	    var resp = await dashRPC.listTransactionsAsync(3, 1, this.skip)

      let transaction = resp.result[0];

      if (!transaction) {

        this.nextInterval = 10000; // set poll to ten seconds	if no new transaction

      } else {

        console.log(transaction);

        if (transaction.category === "send") {

          this.total -= transaction.amount;
          this.emit('total', this.total)
        }

        this.progress();
      }

		}, this.nextInterval);

	}

	progress() {
		this.skip += 1;
		this.nextInterval = 1000; // set poll to ten seconds	if no new transaction
	}

	async saveProgress(skip) {

	}

	async loadProgress(skip) {

	}
}

module.exports.spawn = function() {

	let totalSent = new TotalSent();

	totalSent.start();

	return totalSent;
}

