import {generateInvoice} from '../../lib/invoice';
import {Payment,Invoice} from '../../types/interfaces';
const http = require("superagent");
export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'ZEC');

  return invoice;

}

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
export async function checkAddressForPayments(address:string,currency:string){
  let payments: Payment[]=[];
    let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${currency}/${address}`)
      for (let tx of resp.body.data.txs){
        let p: Payment = { 
          currency: currency,
          address: resp.body.data.address,
          amount: tx.value,
          hash: tx.txid
        };  
        payments.push(p)
      }
  return payments 
}

