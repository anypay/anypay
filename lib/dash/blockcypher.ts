const http = require('superagent');
const Blockcypher = require('../blockcypher');
const log = require('winston');

import {BLOCKCYPHER_CALLBACKS_BASE} from '../blockcypher';

let token = process.env.BLOCKCYPHER_TOKEN;

export function createPaymentEndpoint(merchantAddress): Promise<any> {

	return new Promise((resolve, reject) => {
		let webhook = {
			destination: merchantAddress,
			callback_url: `${BLOCKCYPHER_CALLBACKS_BASE}/dash/webhooks`,
      mining_fees_satoshis: Blockcypher.DASH_FEE
		};

    if (process.env.BLOCKCYPHER_PROCESS_FEES_DASH_ADDRESS) {

      webhook['process_fees_address'] = process.env.BLOCKCYPHER_PROCESS_FEES_DASH_ADDRESS;

      /* approx 0.01 USD at 80 USD/DASH price */
      webhook['process_fees_satoshis'] = 100000000 / 8000;

    }

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

