const http = require("superagent")

require("dotenv").config();

import { getLegacyAddressFromCashAddress } from '../plugins/bch/lib/bitbox'

import { log } from './logger'

import { statsd } from './stats/statsd'

const supportedCurrencies = {

  'BCH': true,

  'DASH': true,

  'LTC': true,

  'RVN': true
};

export async function createCoinTextInvoice(address:string, amount:number, currency:string):Promise<any>{

  if (!supportedCurrencies[currency]) {

    return;

  }

  statsd.increment('CoinTextInvoiceCreated')	

  let start = new Date().getTime()

  if( currency=='BCH' ){
    
    address = getLegacyAddressFromCashAddress(address)

  }

  log.info("cointext.params", {address, amount, currency })

  return new Promise((resolve,reject)=>{
    http
      .post("https://pos-api.cointext.io/create_invoice/")
      .send({
        address: address,
	amount: amount*100000000,
	network: currency,
	api_key: process.env.COIN_TEXT_API_KEY
	})
      .set("Content-Type", "application/json")
      .end((error, resp) => {
      if (error) {

        statsd.timing('GenerateCoinTextInvoice', new Date().getTime()-start)
        log.error(error.message)
	return reject(error) 
	}
       statsd.timing('BCH_generateInvoiceAddress', new Date().getTime()-start)
       resolve(resp.text);

      });
  })

}

