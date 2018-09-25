const http = require("superagent")
import {generateInvoice} from '../../lib/invoice';;
import {Payment,Invoice} from '../../types/interfaces';
export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'LTC');

  return invoice;

}

export async function checkAddressForPayments(address:string, currency:string){
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
   return payments;
}

