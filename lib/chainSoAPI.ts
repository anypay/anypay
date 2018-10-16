const http = require("superagent");
import {Payment,Invoice} from '../types/interfaces';

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
export async function checkAddressForPayments(address:string, currency:string): Promise<Payment[]>{
  let payments: Payment[]=[];

    let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${currency}/${address}`)
      for (let tx of resp.body.data.txs){
        let p: Payment = { 
          currency: currency,
          address: address,
          amount: tx.value,
          hash: tx.txid
        };  
        payments.push(p)
       }
  return payments 
}

