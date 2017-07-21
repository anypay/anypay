
const http = require('superagent');

let token = process.env.BLOCKCYPHER_TOKEN;

function createWebhook(address) {
	return new Promise((resolve, reject) => {
		let webhook = {
			event: "unconfirmed-tx",
			address: address,
			url: "https://blockcypher.anypay.global/blockcypher/webhooks"
		};

		http
			.post(`https://api.blockcypher.com/v1/dash/main/hooks?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) { return reject(error) };
				resolve(response.body);
			});
  });
};

function createTxConfirmationWebhook(address) {
	return new Promise((resolve, reject) => {
		let webhook = {
			event: "confirmed-tx",
			address: address,
			url:
      "https://blockcypher.anypay.global/blockcypher/webhooks/tx-confirmation"
		};

		http
			.post(`https://api.blockcypher.com/v1/dash/main/hooks?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) { return reject(error) };
				resolve(response.body);
			});
  });
};

module.exports.createWebhook = createWebhook;

