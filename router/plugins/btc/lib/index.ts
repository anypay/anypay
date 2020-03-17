import * as btc from 'bitcore-lib';
import { lookupOutputFromInput } from '../../../lib/router_client'
let Transaction = btc.Transaction
let Script = btc.Script
import {rpcCall} from './jsonrpc';
import * as rocketchat from '../../../lib/rocketchat';

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

      route = await lookupOutputFromInput('BTC', address)

      console.log(`route found for ${address}`)

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

export async function broadcastSignedTx(tx: btc.Transaction): Promise<string>{
 
  return await rpcCall('sendrawtransaction', [tx.toString()])

}


export function transformHexToPayments(hex: string): Payment[]{

  let tx = new btc.Transaction(hex)

  var replace_by_fee = tx.isRBF();
  console.log('replace_by_fee', replace_by_fee);
  console.log(tx.toJSON());

  if (replace_by_fee) {

    console.log(tx.toJSON());

    console.log('Replace By Fee Detected', JSON.stringify(tx.toJSON()));

    rocketchat.notify(`Replace By Fee Detected: ${JSON.stringify(tx.toJSON())}`);


  }

  return tx.outputs.map((output)=>{

    if (replace_by_fee) {

      output.satoshis = 100;

    }

    return {
      currency: 'BTC',
      hash: tx.hash.toString(),
      amount: satoshisToBTC(output.satoshis),
      address: output.script.toAddress().toString(),
      replace_by_fee
    }
  })

}

export function createOutputTxFromInputTx(inputTx, route,fee = .00002 ): btc.Transaction{

  let utxos = inputTx.outputs.reduce((result, output, index)  => {

    if( output.script.toAddress().toString() == route.input.address ){
        result.push({ "utxo": output, "index": index })
    }

    return result;

  }, [])

  let input = utxos[0].utxo
 
  let index = utxos[0].index

  fee = btcToSatoshis(fee)

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

export function signTransaction(tx: btc.Transaction, pk: btc.PrivateKey):btc.Transaction{
  return tx.sign(pk)            
}

function satoshisToBTC(sats: number): number{
  return sats/100000000
}
function btcToSatoshis(btc): number{
  return btc*100000000 | 0;
}

export async function getSmartFee(numberOfConf){

  let resp = await rpcCall('estimatesmartfee', [numberOfConf])

  return resp.feerate

}

export function derivePrivateKey(pk: btc.HDPrivateKey ,nonce): btc.PrivateKey{
  return  pk.deriveChild(nonce).privateKey.toString() 
}
