import { Payment } from '../../../types/interfaces'

const http = require("superagent");

//import {emitter} from '../../../lib/events'

import { log } from '../../../lib';

const WebSocket = require('ws');

export function rippleLib_checkAddressForPayments(address:string, tag?:number){

  log.info(`check for payments acct:${address} - tag:${tag}`);

  return new Promise((resolve, reject) => {

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
      
       //console.log("Ripplelib.websocket.open")

       ws.send(JSON.stringify(req));

    })

    ws.on('message', async (data)=>{

      //console.log("Ripplelib.incoming.message", data)

      try{ 

        ws.close();

        let payments = await parsePaymentsFromAccount_tx(data);

        if (tag) {

          payments = payments.filter(payment => {

            return payment.address === `${address}?dt=${tag}`;

          });
        }

        resolve(payments[0]);


      } catch(err){

        console.error(err.message)
        reject(err);

      }

    })

    ws.on('error', reject);

    ws.on('close',()=>{console.log})

  });


}

export async function parsePaymentsFromAccount_tx(data){

  return parsePaymentsFromAccount_tx2(data)

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

export function parsePaymentFromTransaction(transaction) {

  let tx = filterTxns([{ tx: transaction }])[0].tx;

  console.log("TX", tx);

  if (!tx) {

    return false;

  }

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

  if (tx.DestinationTag != undefined) {

    receiveAddress = `${receiveAddress}?dt=${tx.DestinationTag}`;
   
  }
    
  let p: Payment = {

    currency: currency,
    address: receiveAddress,
    amount: amount,
    hash: tx.hash

  }

  return p;

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

    if (tx.DestinationTag != undefined) {

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

