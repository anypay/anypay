const http = require("superagent")

require("dotenv").config();

export async function createCoinTextInvoice(address:string, amount:number, currency:string):Promise<any>{

  return new Promise((resolve,reject)=>{
    http
      .post("https://pos-api.cointext.io/create_invoice/")
      .send({
        address: address,
	amount: amount,
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

