require('dotenv').config();
import * as bch from 'bitcore-lib-cash';
var rp = require('request-promise');
import {log, models, prices} from '../../../lib';

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

export async function getAdditionalOutputs(vendingTransactionId:number){

  let vending_tx = await models.VendingTransaction.findOne({
    where: { id: vendingTransactionId }
  })

  let spreadPercentage = vending_tx.expected_profit_setting/100;

  let spreadAmount = vending_tx.cash_amount * spreadPercentage;

  let bchToSend = (await prices.convert({ currency: 'USD', value: spreadAmount}, 'BCH')).value 

  let balance = await getbalance();

  if( bchToSend > balance ) throw new Error(`Hot wallet has insufficent funds to send ${bchToSend}: wallet balance - ${balance}`);

  let strategy = (await models.VendingOutputStrategy.findOne({ where: { id: vending_tx.additional_output_strategy_id }})).strategy

  let outputs = []; 

  await Promise.all(strategy.outputs.map(async (output:any) => {

    let address = await models.Address.findOne({ where: {account_id: output.account_id}})

    if( !address ) throw new Error(`BCH is not set for all accounts in strategy ${strategy.id}`)

    outputs.push([address.value, (bchToSend*output.scaler).toFixed(5)])

  }));

  return outputs

}

export async function sendAdditionalOutputs(outputs:any[][], vending_tx_id: number):Promise<string>{

  let vending_tx = await models.VendingTransaction.findOne({where:{id:vending_tx_id}});

  if( !vending_tx ) throw new Error('Invalid Vending Transaction Id - Cannot send additonal outputs'); 
       
  if( vending_tx.hash ) throw new Error(`Additional outputs already sent for vending transaction ${vending_tx.id}`);

  let txid = await sendtomany(outputs);

  if( txid ){
  
    await Promise.all( outputs.map( async (output:any)=>{

      let address = await models.Address.findOne({where:{value:output[0]}})

      if( !address ) throw new Error(`Cannot find account with address ${output[0]}`)

      await models.VendingTransactionOutput.create({
        vending_transaction_id: vending_tx.id,
        strategy_id : vending_tx.additional_output_strategy_id,
        isKioskCutomer: false,
        account_id: address.account_id,
        currency: 'BCH',
        hash: txid,
        amount: output[1]

      })

    }));

    let bchSum = outputs.reduce((a,b) => a+parseFloat(b[1]),0)

    let usdSum = (await prices.convert({ currency: 'BCH', value: bchSum}, 'USD')).value

    await vending_tx.update({
        additional_output_usd_paid :  usdSum,
        additional_output_bch_paid :  bchSum,
        additional_output_hash : txid 
    })

  }

  return txid
}
