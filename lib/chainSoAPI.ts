const http = require("superagent");
import {Payment,Invoice} from '../types/interfaces';

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
export async function checkAddressForPayments(invoice:Invoice): Promise<Payment[]>{
  let payments: Payment[]=[];
  let prom =  new Promise<Payment[]>( async (resolve,reject)=>{
  try {
    let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${invoice.currency.toUpperCase()}/${invoice.address}`)
      for (let tx of resp.body.data.txs){
        let p: Payment = { 
          currency: invoice.currency,
          address: invoice.address,
          amount: tx.value,
          hash: tx.txid
        };  
        payments.push(p)
      }
        resolve(payments);
    }  
    catch(error) {
      resolve(null)
    }
  });
  return prom 
}

