import { Payment } from '../../../types/interfaces'

const http = require("superagent");

import {emitter} from '../../../lib/events'

const WebSocket = require('ws');

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
    
     console.log("Ripplelib.websocket.open")

     ws.send(JSON.stringify(req));

  })

  ws.on('message',(data)=>{

    console.log("Ripplelib.incoming.message", data)

    try{ 

      parsePaymentsFromAccount_tx(data)

    }
    catch(err){

      console.log(err)

    }

  })


  ws.on('close',()=>{console.log})

}

export async function parsePaymentsFromAccount_tx(data){

  let res = JSON.parse(data);

  if( typeof(res.result) == 'undefined'){return}
      
  for( let i = 0; i<res.result.transactions.length;i++){

    if( typeof(res.result.transactions[i].tx) == 'undefined'){continue}
        
    if( res.result.transactions[i].tx.TransactionType != 'Payment'){continue}

      let currency = "XRP"

      let amount = 0

    if( typeof(res.result.transactions[i].tx.Amount) == 'string'){

      amount = res.result.transactions[i].tx.Amount

      amount = amount/1000000

    }

    else{

      currency = "XRP."+res.result.transactions[i].tx.Amount.currency+"."+res.result.transactions[i].tx.Amount.issuer

      amount = res.result.transactions[i].tx.Amount.value

    }

    let receiveAddress = res.result.transactions[i].tx.Destination

    if( typeof(res.result.transactions[i].tx.DestinationTag) != 'undefined'){ 
      

      receiveAddress = res.result.transactions[i].tx.Destination+'?dt='+res.result.transactions[i].tx.DestinationTag

     
    }
      
    let p: Payment = {

      currency: currency,
      address: receiveAddress,
      amount: amount,
      hash: res.result.transactions[i].tx.hash

    }

    emitter.emit('payment', p)

  }

}
