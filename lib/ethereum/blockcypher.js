const http = require('superagent');
const Blockcypher = require('../blockcypher');

let token = process.env.BLOCKCYPHER_TOKEN;

function createPaymentWebhook(merchantAddress) {

	return new Promise((resolve, reject) => {
		let webhook = {
      event: "unconfirmed-tx",
			address: merchantAddress,
			url: "https://blockcypher.anypay.global/ethereum/webhooks"
		};

		http
			.post(`https://api.blockcypher.com/v1/eth/main/hooks?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) { return reject(error) };
				resolve(response.body);
			});
  });
};

module.exports.createPaymentWebhook = createPaymentWebhook;

