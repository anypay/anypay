const http = require("superagent");
import {Payment,Invoice} from '../../types/interfaces';
/*export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'DOGE');

  return invoice;

}*/

export async function getAddressPayments(invoice:Invoice){
let payments: Payment[]=[];
  let prom =  new Promise<Payment[]>( async (resolve,reject)=>{
  try {
    let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${invoice.currency.toUpperCase()}/${invoice.address}`)
    console.log(`https://chain.so/api/v2/get_tx_received/${invoice.currency.toUpperCase()}/${invoice.address}`)
      for (let tx of resp.body.data.txs){
        let p: Payment = { 
          currency: invoice.currency,
          address: resp.body.address,
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

