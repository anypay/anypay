const http = require("superagent")

require("dotenv").config();
import { getLegacyAddressFromCashAddress } from '../plugins/bch/lib/bitbox'

export async function createCoinTextInvoice(address:string, amount:number, currency:string):Promise<any>{

  if( currency=='BCH' ){
    
    address = getLegacyAddressFromCashAddress(address)

  }

  console.log("COINTEXT PARAMS:", address, amount, currency, process.env.COIN_TEXT_API_KEY)

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
        
        console.log(error)
	return reject(error) 
       }
       resolve(resp.text);

      });
  })

}

