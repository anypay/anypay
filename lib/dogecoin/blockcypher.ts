const http = require('superagent');
const Blockcypher = require('../blockcypher');

let token = process.env.BLOCKCYPHER_TOKEN;

import {BLOCKCYPHER_CALLBACKS_BASE} from '../blockcypher';

export function createPaymentEndpoint(merchantAddress): Promise<any> {
  console.log('dogecoin:blockcypher:payment:create', merchantAddress);

	return new Promise((resolve, reject) => {
		let webhook = {
			destination: merchantAddress,
			callback_url: `${BLOCKCYPHER_CALLBACKS_BASE}/dogecoin/webhooks`,
      mining_fees_satoshis: Blockcypher.DOGECOIN_FEE
		};

		http
			.post(`https://api.blockcypher.com/v1/doge/main/payments?token=${token}`)
			.send(webhook)
			.end((error, response) => {
				if (error) {return reject(error) };
				resolve(response.body);
			});
  });
};


