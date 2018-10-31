const http = require("superagent")

require("dotenv").config();

import {Payment} from '../../../types/interfaces';

import { connection, channel } from './amqp';

const routing_key = 'payment';

const exchange = 'anypay.payments';

const JSONRPC = require('./jsonrpc');
  
var rpc = new JSONRPC();

export async function anypay_checkAddressForPayments(address:string, currency:string){

  let resp = await rpc.getAddress(address)

  let payments: Payment[]=[]

  try{

    for(let i = 0; i<resp.transactions.length;i++){

      let tx = await rpc.getTransaction(resp.transactions[i])


      for( let j=0; j<tx.vout.length;j++){

	if(tx.vout[j].scriptPubKey.addresses[0] != address ){continue}	

        let p: Payment  = {
  
          hash: resp.transactions[i],
  
          amount: tx.vout[j].value,
 
          address: tx.vout[j].scriptPubKey.addresses[0],
  
          currency: 'ZEN'
 
        }

        console.log(p)
    
        channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));

        payments.push(p)
    
      }

    }

  }

  catch(err){console.log(err)}

  return(payments)

}

