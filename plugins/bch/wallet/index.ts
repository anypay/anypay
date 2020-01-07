require('dotenv').config();
import * as bch from 'bitcore-lib-cash';
var rp = require('request-promise');
import {log, models} from '../../../lib';

interface Output{
  address: string;
  amount: number;
}

export async function sendtomany(outputs: any[][]):Promise<string>{

  log.info( "bch.hot.wallet.sendtomany", outputs)

  let params = {
    "password": process.env.BCH_HOT_WALLET_PASSWORD,
    "outputs":outputs 
  }

  let hex = (await walletrpc('paytomany', params)).hex;

  let tx = await walletrpc('broadcast', {"tx": hex});

  log.info("tx broadcasted", tx[1])

  return tx[1];
}

export async function getbalance():Promise<number>{

  log.info("bch.hot.wallet getbalance");

  return parseFloat((await walletrpc('getbalance', [])).confirmed)

}

export async function getaddress():Promise<string>{

  log.info("bch.hot.wallet getaddress");

  return await walletrpc('getunusedaddress', [])

}

export async function sendtoaddress(output: any[]):Promise<string>{

  log.info("bch.hot.wallet sendtoaddress", output )

  let params = {
    "destination": output[0],
    "amount": output[1],
    "password": process.env.BCH_HOT_WALLET_PASSWORD
  }

  let hex = (await walletrpc('payto', params)).hex;

  let tx = await walletrpc('broadcast', {"tx": hex});

  log.info("tx broadcasted", tx[1])

  return tx[1]; 

}

export async function sendFrom(arr: any[]):Promise<string>{

  let output = [arr[1], arr[2]]

  return await sendtomany([output])

}

export async function listunspent():Promise<any[]>{

  log.info("listunspent")

  return await walletrpc('listunspent', [])

}

function unspentOutputToUTXO( unspent ): bch.UnspentOutput{
   return {
     txId: unspent.prevout_hash,
     outputIndex: unspent.prevout_n,
     address : unspent.address,
     amount : unspent.value,
     script: bch.Script( new bch.Address(unspent.address)).toHex()
  }
}

export async function walletrpc(method: string, params: any){

  var options = {
    method: 'POST',
    uri: `http://${process.env.BCH_ELECTRUM_RPC_USER}:${process.env.BCH_ELECTRUM_RPC_PASSWORD}@${process.env.BCH_ELECTRUM_RPC_HOST}:${process.env.BCH_ELECTRUM_RPC_PORT}`,
    body: {
      method: `${method}`,
      params: params || [],
      id: 0
    },
    json: true // Automatically stringifies the body to JSON
  };

  let res = await rp(options)

  return res.result

}
