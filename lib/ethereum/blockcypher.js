const http = require('superagent');
const Blockcypher = require('../blockcypher');
const log = require('winston');

let token = process.env.BLOCKCYPHER_TOKEN;

const WEBHOOKS_URL = process.env.ANYPAY_BLOCKCYPHER_ETHEREUM_WEBHOOKS_URL;

if (!WEBHOOKS_URL) {
  log.error('ANYPAY_BLOCKCYPHER_ETHEREUM_WEBHOOKS_URL must be set.');

  throw new Error('ANYPAY_BLOCKCYPHER_ETHEREUM_WEBHOOKS_URL must be set.');
}

function createPaymentWebhook(merchantAddress) {

	return new Promise((resolve, reject) => {
		let webhook = {
      event: "unconfirmed-tx",
			address: merchantAddress,
			url: WEBHOOKS_URL
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

