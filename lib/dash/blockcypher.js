const http = require('superagent');
const Blockcypher = require('../blockcypher');
const log = require('winston');

let token = process.env.BLOCKCYPHER_TOKEN;

const WEBHOOKS_URL = process.env.ANYPAY_BLOCKCYPHER_DASH_WEBHOOKS_URL;

function createPaymentEndpoint(merchantAddress) {

	return new Promise((resolve, reject) => {
		let webhook = {
			destination: merchantAddress,
			callback_url: WEBHOOKS_URL,
      mining_fees_satoshis: Blockcypher.DASH_FEE
		};

    log.info('blockcypher:dash:payment:create', webhook);
    log.info('blockcypher:token', token);

		http
			.post(`https://api.blockcypher.com/v1/dash/main/payments?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) { return reject(error) };
				resolve(response.body);
			});
  });
};

module.exports.createPaymentEndpoint = createPaymentEndpoint;

