const http = require('superagent');
const Blockcypher = require('../blockcypher');

let token = process.env.BLOCKCYPHER_TOKEN;

import {BLOCKCYPHER_CALLBACKS_BASE} from '../blockcypher';

function createPaymentEndpoint(merchantAddress) {

	return new Promise((resolve, reject) => {
		let webhook = {
			destination: merchantAddress,
			callback_url: `${BLOCKCYPHER_CALLBACKS_BASE}/bitcoin/webhooks`,
      mining_fees_satoshis: Blockcypher.BITCOIN_FEE
		};

		http
			.post(`https://api.blockcypher.com/v1/btc/main/payments?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) { return reject(error) };
				resolve(response.body);
			});
  });
};

module.exports.createPaymentEndpoint = createPaymentEndpoint;

