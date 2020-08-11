import * as dash from '@dashevo/dashcore-lib';
import { lookupOutputFromInput } from '../../../lib/router_client'
let Transaction = dash.Transaction
let Script = dash.Script
import {rpcCall} from './jsonrpc';

import { fromSatoshis, toSatoshis } from '../../../../lib/pay'

interface Payment{
  amount: number;
  hash: string;
  currency: string;
  address: string;
}

interface Route{
  input: {
    currency: string;
    address: string;
  };
  output: {
   currency: string;
   address: string;
  };
  HDKeyAddress: {
    address: string;
    currency: string;
    id: number;
  };
}

export async function getAddressRouteFromTx(tx):Promise<Route>{

  var route;

  var value;

  for (let i=0; i < tx.outputs.length; i++) {

    let address = tx.outputs[i].script.toAddress().toString();

    try {

      route = await lookupOutputFromInput('DASH', address)

    } catch(error) {


      console.error(error.message);

    }

      if (route) {
       
        break;

      }

    }

    if (!route) {

      throw(`No Address route found for tx ${tx.hash}`) 

    }

   return route

}

export async function broadcastSignedTx(tx: dash.Transaction): Promise<string>{
 
  return await rpcCall('sendrawtransaction', [tx.toString()])

}


export function transformHexToPayments(hex: string): Payment[]{

  let tx = new dash.Transaction(hex)

  return tx.outputs.map((output)=>{

          return {
            currency: 'DASH',
            hash: tx.hash.toString(),
            amount: fromSatoshis(output.satoshis),
            address: output.script.toAddress().toString()
          }
  })

}

export function createOutputTxFromInputTx(inputTx, route,fee = .00002 ): dash.Transaction{

  let utxos = inputTx.outputs.reduce((result, output, index)  => {

    if( output.script.toAddress().toString() == route.input.address ){
        result.push({ "utxo": output, "index": index })
    }

    return result;

  }, [])

  let input = utxos[0].utxo
 
  let index = utxos[0].index

  fee = toSatoshis(fee)

  if (input.satoshis < fee) {

     throw(new RangeError(`Fee: ${fee} satoshis is greater than the unspent output: ${input.satoshis} satoshis`));
  }

  let utxo = {
    "txId": inputTx.hash,
    "outputIndex": index, 
    "satoshis": input.satoshis,
    "address" : input.script.toAddress().toString(), 
    "script": input.script.toHex() 
  }

  let amountToSpend = input.satoshis - fee 

  let outputTx = new Transaction()
    .from(utxo)
    .to(route.output.address, amountToSpend )

  return outputTx;

}

export function signTransaction(tx: dash.Transaction, pk: dash.PrivateKey):dash.Transaction{
  return tx.sign(pk)            
}

export async function getSmartFee(numberOfConf){

  let resp = await rpcCall('estimatesmartfee', [numberOfConf])

  return resp.feerate

}

export function derivePrivateKey(pk: dash.HDPrivateKey ,nonce): dash.PrivateKey{
  return  pk.deriveChild(nonce).privateKey.toString() 
}
