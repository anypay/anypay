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

  //Customer -> 80%
  let output1 = [arr[1], arr[2]]

  let account = await models.Account.findOne({where:{ email: arr[0] }});
  
  if( account ){

    let hostAddress = await models.Address.findOne({where:
      {
        currency: "BCH",
        account_id: account.id
      }});

    //Terminal is hosted by Anypay account 
    if( hostAddress ){

      log.info("SendFrom - BCH Address found", hostAddress.toJSON())

      //Terminal host -> 10%
      let output3 = [hostAddress.value, (arr[2]/8).toFixed(8)]

      //Anypay -> 10%
      let output2 = [process.env.ANYPAY_X_PROFIT_ADDRESS, (arr[2]/8).toFixed(8)]

      return await sendtomany([output1,output2,output3])

    }

  }

  log.info("SendFrom - No BCH Address found", arr[3])

  let output2 = [process.env.ANYPAY_X_PROFIT_ADDRESS, (arr[2]/4).toFixed(8)]

  return await sendtomany([output1,output2])

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
