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

  parsePaymentsFromAccount_tx2(data).forEach(payment => {

    emitter.emit('payment', payment);

  });

}


function filterTxns(transactions) {

  return transactions.filter(tx => {

    return typeof(tx.tx) !== 'undefined';

  });

}

function filterPayments(transactions) {

  return transactions.filter(t => {

    return t.tx.TransactionType === 'Payment';

  });

}

export function parsePaymentsFromAccount_tx2(data) {

  let res = JSON.parse(data);

  if( typeof(res.result) == 'undefined' || !res.result.transactions){
    throw new Error('xrp.accounttx.parse.error')
  }

  let validTransactions = filterTxns(res.result.transactions);

  return filterPayments(validTransactions).map(t => t.tx).map(tx => {

    var amount, currency;

    if( typeof(tx.Amount) == 'string'){

      // XRP Payment

      amount = parseFloat(tx.Amount) / 1000000; // Convert from drops to XRP

      currency = 'XRP';

    } else {

      // Non XRP Payment

      currency = `XRP.${tx.Amount.currency}.${tx.Amount.issuer}`;

      amount = tx.Amount.value;

    }

    var receiveAddress = tx.Destination;

    if (tx.DestinationTag !== null) {

      receiveAddress = `${receiveAddress}?dt=${tx.DestinationTag}`;
     
    }
      
    let p: Payment = {

      currency: currency,
      address: receiveAddress,
      amount: amount,
      hash: tx.hash

    }

    return p;

  });

}

