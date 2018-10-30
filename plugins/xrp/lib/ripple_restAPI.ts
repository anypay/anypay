import { Payment } from '../../../types/interfaces'

const http = require("superagent");

import { connection, channel } from './amqp';

const routing_key = 'payment';

const exchange = 'anypay.payments';

export async function ripple_restAPI_checkAddressForPayments(address:string){

  let payments: Payment[]=[];

  return new Promise(async (resolve,reject) =>{
    
   let resp = await http.get(`https://data.ripple.com/v2/accounts/${address}/transactions`)

   for(let i=resp.body.transactions.length-1; i>-1;i--){

     if( i < resp.body.transactions.length - 25 ){ break }

     if(resp.body.transactions[i].tx.TransactionType == 'Payment'){

     let currency = 'XRP'

     let amount = resp.body.transactions[i].tx.Amount

      if( typeof(resp.body.transactions[i].tx.Amount.currency) != 'undefined'){

         currency = 'XRP.'+resp.body.transactions[i].tx.Amount.currency

       }
        if( typeof(resp.body.transactions[i].tx.Amount.value) != 'undefined' ){

         amount = resp.body.transactions[i].tx.Amount.value

       }

       let p: Payment = {

         currency: currency,
         address: resp.body.transactions[i].tx.Account,
         amount: amount,
         hash: resp.body.transactions[i].hash

       }

       payments.push(p)

       channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));

      }

    }
    
    console.log("payments", payments)

    resolve(payments)

  })

}
