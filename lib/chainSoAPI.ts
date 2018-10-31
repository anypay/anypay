const http = require("superagent");
import * as amqp from 'amqplib';

import { connection, channel } from './amqp';

const routing_key = 'payment';

const exchange = 'anypay.payments';

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
	channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));
       }
  return payments 
}

