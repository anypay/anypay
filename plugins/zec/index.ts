import {generateInvoice} from '../../lib/invoice';
import {Payment,Invoice} from '../../types/interfaces';
const http = require("superagent");
export async function createInvoice(accountId: number, amount: number) {

  let invoice = await generateInvoice(accountId, amount, 'DASH');

  return invoice;

}

//@param invoice - an existing invoice
//@return - A promise containing an array of recieved tx to the invoice address
export async function getAddressPayments(invoice:Invoice): Promise<Payment[]>{
  let payments: Payment[]=[];
  let prom =  new Promise<Payment[]>( async (resolve,reject)=>{
  try {
    let resp = await http.get(`https://chain.so/api/v2/get_tx_received/${invoice.currency.toUpperCase()}/${invoice.address}`)
      for (let tx of resp.body.data.txs){
        let p: Payment = { 
          currency: invoice.currency,
          address: resp.body.data.address,
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

