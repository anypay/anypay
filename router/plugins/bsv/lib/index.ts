import * as bsv from 'bsv';
import { lookupOutputFromInput } from '../../../lib/router_client'
let Transaction = bsv.Transaction
let Script = bsv.Script
import {rpcCall} from './jsonrpc';

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

  console.log('getting tx for: ', tx)

  var route;

  var value;

  for (let i=0; i < tx.outputs.length; i++) {

    let address = tx.outputs[i].script.toAddress().toString();

    try {

      route = await lookupOutputFromInput('BSV', address)

      console.log(`route found for ${address}`, route)

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

export async function broadcastSignedTx(tx: bsv.Transaction): Promise<string>{
 
  let txid =  await rpcCall('sendrawtransaction', [tx.toString()])
  console.log('result', txid)
  console.log('tx', tx)
  return txid;

}


export function transformHexToPayments(hex: string): Payment[]{

  let tx = new bsv.Transaction(hex)

  let payments = [];

  for( let i = 0; i < tx.outputs.length; i++){

    let address = tx.outputs[i].script.toAddress().toString();

    let paymentIndex = payments.findIndex((elem) =>{ return elem.address === address})

    if( paymentIndex > -1 ){

      payments[paymentIndex] = {

        currency: 'BSV',
        hash: tx.hash.toString(),
        amount: satoshisToBSV(tx.outputs[i].satoshis) + payments[paymentIndex].amount,
        address: tx.outputs[i].script.toAddress().toString()

      }
      
    }else{

      payments.push({

        currency: 'BSV',
        hash: tx.hash.toString(),
        amount: satoshisToBSV(tx.outputs[i].satoshis),
        address: tx.outputs[i].script.toAddress().toString()

      })
      
    }

  }

  console.log(payments)
  return payments

}

export function createOutputTxFromInputTx(inputTx, route,fee = .00002 ): bsv.Transaction{

  let utxos = inputTx.outputs.reduce((result, output, index)  => {

    if( output.script.toAddress().toString() == route.input.address ){
        result.push({ "utxo": output, "index": index })
    }

    return result;

  }, [])

  let input = utxos[0].utxo
 
  let index = utxos[0].index

  fee = bsvToSatoshis(fee)

  if (input.satoshis < fee) {

     throw(new RangeError(`Fee: ${fee} satoshis is greater than the unspent output: ${input.satoshis} satoshis`));

     return;
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

export function signTransaction(tx: bsv.Transaction, pk: bsv.PrivateKey):bsv.Transaction{
  return tx.sign(pk)            
}

function satoshisToBSV(sats: number): number{
  return sats/100000000
}
function bsvToSatoshis(bsv): number{
  return bsv*100000000 | 0;
}

export async function getSmartFee(numberOfConf){

  let resp = await rpcCall('estimatesmartfee', [numberOfConf])

  return resp.feerate

}

export function derivePrivateKey(pk: bsv.HDPrivateKey ,nonce): bsv.PrivateKey{
  return  pk.deriveChild(nonce).privateKey.toString() 
}
