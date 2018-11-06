import { Payment } from '../../../types/interfaces'

const http = require("superagent");

import { connection, channel } from './amqp';

const WebSocket = require('ws');

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

         currency = 'XRP.'+resp.body.transactions[i].tx.Amount.currency+"."+resp.body.transactions[i].tx.Amount.issuer

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

       console.log(p)

       channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));

      }

    }
    
    console.log("payments", payments)

    resolve(payments)

  })

}

export async function rippleLib_checkAddressForPayments(address:string){

  let payments: Payment[]=[];

  let req = {

      "id": 2,
      "command": "account_tx",
      "account": address,
      "ledger_index_min": -1,
      "ledger_index_max": -1,
      "binary": false,
      "limit": 10,
      "forward": false
  }
 
  let ws = new WebSocket('wss://s2.ripple.com:443')
  
  ws.on('open',()=>{

     ws.send(JSON.stringify(req));

  })

  ws.on('message',(data)=>{

    let res = JSON.parse(data);

    for( let i = 0; i<res.result.transactions.length;i++){

      if( res.result.transactions[i].tx.TransactionType != 'Payment'){continue}

      let currency = "XRP"

      let amount = 0

      if( typeof(res.result.transactions[i].tx.Amount) == 'string'){

        amount = res.result.transactions[i].tx.Amount

      }

      else{

        currency = "XRP."+res.result.transactions[i].tx.Amount.currency+"."+res.result.transactions[i].tx.Amount.issuer

        amount = res.result.transactions[i].tx.Amount.value

      }

      let receiveAddress = res.result.transactions[i].tx.Destination

      if( typeof(res.result.transactions[i].tx.DestinationTag) != 'undefined'){ 
      
        receiveAddress = res.result.transactions[i].tx.Destination+'?'+res.result.transactions[i].tx.DestinationTag
     
      }
      
      let p: Payment = {

        currency: currency,
        address: receiveAddress,
        amount: amount,
        hash: res.result.transactions[i].tx.hash

      }

      payments.push(p)

      channel.publish(exchange, routing_key, new Buffer(JSON.stringify(p)));

    }

  })


  ws.on('close',()=>{console.log})


  return payments;

}
