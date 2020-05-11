/*require('dotenv').config();

import {rpcCall} from './jsonrpc'

const http = require('superagent')

import { toLegacyAddress } from 'bchaddrjs';

let btc = require('bitcore-lib')

let Transaction = btc.Transaction

import { Route, AddressRouteTransform } from '../../../lib/interfaces';

import {createOutputTxFromInputTx} from './createOutputTxFromInputTx'

import { channel } from '../../../lib/events';

import { publishEvent } from '../../../lib/events';

import { lookupOutputFromInput } from '../../../lib/router_client'


export async function forwardPayment(txid: string, blockPriority = 12): Promise<any> {


    let fee = await getSmartFee(blockPriority);

    console.log('fee calculated', fee)

    let tx = await rpcCall('gettransaction', [txid]);

    console.log('tx', tx)

    let rawTx = Transaction(tx.hex)

    var route;

    var value;

    for (let i=0; i < rawTx.outputs.length; i++) {

      let address = toLegacyAddress(rawTx.outputs[i].script.toAddress().toString());

      try {

        route = await lookupOutputFromInput('BTC', address)

        value = satoshisToBTC(rawTx.outputs[i].satoshis)

        console.log('value', value)

        console.log(`route found for ${address}`)

      } catch(error) {

        console.log(`error getting route for ${address}`, error.message);

        console.error(error.message);

      }

      if (route) {
       
        break;

      }

    }

    console.log('value', value)

    if (!route) {

      return;

    }

    let paymentRoute = {
      input: route.input,
      outputs: [route.output]
    }

    let transform = {
    
      inputTxPrivateKey : generatePrivateKey(route.HDKeyAddress.id, process.env.BTC_XPRIV_KEY),
      inputTxHex : tx.hex,
      route: paymentRoute,
      fee: fee

    }

    console.log('transform', transform)

    var signedTx;

    try{

     signedTx = createOutputTxFromInputTx(transform)

    }catch(error){

      console.log(error)

    }

    console.log('signed tx', signedTx)
 
    try {

      var newtx = await rpcCall('sendrawtransaction', [signedTx]);

    } catch(error) {

      console.error('sendrawtransaction.error', error.response.body.error.message);

      await publishEvent('error', {
        stage: 'sendrawtransaction',
        txid,
        message: error.message,
        response: error.response.body.error.message
      });

      throw error;

    }

      
    let paymentMessage = JSON.stringify({

      address: route.input_address,

      currency: 'BTC',

      amount: value,

      hash: txid,

      output_currency: route.output_currency,

      output_hash: newtx
    
    });

    await channel.publish('anypay.payments', 'payment',
      new Buffer(paymentMessage)
    );

   return paymentMessage
}

async function getSmartFee(numberOfConf){

  let resp = await rpcCall('estimatesmartfee', [numberOfConf])

  return resp.feerate

}

function generatePrivateKey(nonce, key){

  console.log(key, nonce)
  let master = new btc.HDPrivateKey(key)

  return master.deriveChild(nonce).privateKey.toString()
}

function satoshisToBTC(sat){

  return sat/100000000

}*/
//# sourceMappingURL=forwardPayment.js.map