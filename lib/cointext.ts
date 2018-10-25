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
	api_key: 'aa1b1c7b-fbe2-44e2-a0e7-28857b46294e'
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

