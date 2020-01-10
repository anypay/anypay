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

  if( !vending_tx ) throw new Error(`No vending transaction found with id: ${vendingTransactionId}`)

  if( vending_tx.additional_output_hash ) throw new Error(`Additional output already sent`); 

  let bchToSend = (await prices.convert({ currency: 'USD', value: vending_tx.expected_profit_value}, 'BCH')).value 

  let balance = await getbalance();

  if( bchToSend > balance ) throw new Error(`Hot wallet has insufficent funds to send ${bchToSend}: wallet balance - ${balance}`);

  let strategy = (await models.VendingOutputStrategy.findOne({ where: { id: vending_tx.additional_output_strategy_id }})).strategy

  if( !strategy ) throw new Error(`invalid additional output strategy`)

  let outputs = []; 

  await Promise.all(strategy.outputs.map(async (output:any) => {

    let address = await models.Address.findOne({ where: {account_id: output.account_id}})

    let amount = (bchToSend*output.scaler).toFixed(5)

    if( !address ) throw new Error(`BCH is not set for all accounts in strategy ${strategy.id}`)
    
    let usd_amount = (await prices.convert({ currency: 'BCH', value: parseFloat(amount)}, 'USD')).value

    let vendingOutput = {
      vending_transaction_id: vending_tx.id,
      strategy_id : vending_tx.additional_output_strategy_id,
      isKioskCustomer: false,
      account_id: address.account_id,
      currency: 'BCH',
      amount: amount, 
      address: address.value,
      usd_amount: usd_amount
    }

    let [vendingOutputRecord, isNew] = await models.VendingTransactionOutput.findOrCreate({
      where: {  
        vending_transaction_id: vending_tx.id,
        account_id: address.account_id
      },
      defaults: vendingOutput
    })

    if(!isNew) throw new Error('Output Already Exists in Database')

    outputs.push([address.value, amount])

  }));

  return outputs

}

export async function validateOutputs(outputs: any[][], vending_tx_id: number): Promise<boolean>{

  try{

    let vending_tx = await models.VendingTransaction.findOne({where:{id:vending_tx_id}});

    if( !vending_tx ) throw new Error('Invalid Vending Transaction Id - Cannot send additonal outputs'); 

    if( !vending_tx.hash ) throw new Error('Invalid Vending Transaction - no hash'); 
       
    if( vending_tx.additional_output_hash ) throw new Error(`Additional outputs already sent for vending transaction ${vending_tx.id}`);

    //Check to make sure output is valid and has not been sent
    await Promise.all(outputs.map(async (output)=>{

      let record = await models.VendingTransactionOutput.findOne({
        where:{
          vending_transaction_id: vending_tx_id,
          amount: output[1],
          address: output[0]
        }
      })

      if(!record) throw new Error(`Invalid output vending_transaction_id: ${vending_tx_id} ${output[0]} ${output[1]}`)

      if(record.hash) throw new Error(`Output already sent`)

    }))

    return true

  }catch(err){

    log.info(err)

    return false
  }

}

export async function sendAdditionalOutputs(outputs:any[][], vending_tx_id: number):Promise<string>{

  try{ 

    let vending_tx = await models.VendingTransaction.findOne({where:{id:vending_tx_id}});

    let isValid = await validateOutputs(outputs, vending_tx_id)

    if(!isValid) throw new Error(`invalid outputs`);

    let txid = await sendtomany(outputs);

    if( txid ){
 
      let bchSum = outputs.reduce((a,b) => a+parseFloat(b[1]),0)

      let usdSum = (await prices.convert({ currency: 'BCH', value: bchSum}, 'USD')).value

      await vending_tx.update({
          additional_output_usd_paid :  usdSum,
          additional_output_bch_paid :  bchSum,
          additional_output_hash : txid 
      })

      //Check to make sure output is valid and has not been sent
      await Promise.all(outputs.map(async (output)=>{

        let record = await models.VendingTransactionOutput.findOne({
          where:{
            vending_transaction_id: vending_tx_id,
            amount: output[1],
            address: output[0]
          }
        })

        await record.update({
          hash: txid
        })

      }))

    }

    return txid;

  }catch(err){
    
    log.info(`ERROR sending additional outputs vending.tx: ${vending_tx_id}`, err)

    throw new Error(err)

  }

}
