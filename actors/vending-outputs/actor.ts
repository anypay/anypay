/* implements rabbi actor protocol */

require('dotenv').config();

import * as wallet from '../../plugins/bsv/wallet';

import { Actor, Joi } from 'rabbi';

import {log, models, prices} from '../../lib';

import * as amqp from 'amqplib';

const Op = require('sequelize').Op;

export async function start() {

  let conn = await amqp.connect(process.env.AMQP_URL)

  let chan = await conn.createChannel();

/*
  setInterval( async ()=>{

    await chan.publish('anypay.events', 'outputs.retry.send', Buffer.from('outputs.retry.send'))        

  }, 10000)
*/

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'vending.additional.outputs.retry',

    queue: 'vending.additional.outputs.retry',

    queueOptions: {

      autoDelete: true

    }

  })  
  .start(async (channel, msg) => {

    log.info('outputs.retry.send')

    let vendingTransactions = await models.VendingTransaction.findAll({ 
      where: {
        hash: {
          [Op.ne]:null
        },
        type: "BUY",
        status: "1",
        additional_output_strategy_id:{
          [Op.and]: {
            [Op.ne]:null,
            [Op.ne]:0
          }
        },
        additional_output_hash:{
          [Op.is]:null
        }
      }
    })
    
    let txids = await Promise.all(vendingTransactions.map(async(tx)=>{
     
      return await sendAdditionalOutputs(tx.id)

    }));
    
    log.info('txids sent:', txids);

    channel.ack(msg);

  }); 

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.VendingTransaction.afterCreate',

    queue: 'vending.additional.outputs',

    queueOptions: {

      autoDelete: true

    }

  })  
  .start(async (channel, msg) => {

    let vending_tx =  JSON.parse(msg.content) 

    log.info('vendingTransaction.afterCreate', vending_tx)

    if( vending_tx.status === "1" && vending_tx.type === 'BUY' && !vending_tx.additional_output_hash ){

      let txid = await sendAdditionalOutputs( vending_tx.id)

      log.info(`vending.transaction.${vending_tx.id}.output.send txid: ${txid}`)

    }

    channel.ack(msg);

  }); 

}

if (require.main === module) {

  start();

}


export async function getAdditionalOutputs(vendingTransactionId:number){

  let vending_tx = await models.VendingTransaction.findOne({
    where: { 
      id: vendingTransactionId, 
      additional_output_strategy_id:{
        [Op.ne]: null
      },
      hash: {
        [Op.ne]: null
      },
      additional_output_hash: {
        [Op.is]: null
      },
    }
  })

  if( !vending_tx ) throw new Error(`No vending transaction found with id: ${vendingTransactionId}`)

  let bsvToSend = (await prices.convert({ currency: 'USD', value: vending_tx.expected_profit_value}, 'BSV')).value 

  let balance = await wallet.getbalance();

  if( bsvToSend > balance ) throw new Error(`Hot wallet has insufficent funds to send ${bsvToSend}: wallet balance - ${balance}`);

  let strategy = (await models.VendingOutputStrategy.findOne({ where: { id: vending_tx.additional_output_strategy_id }})).strategy

  if( !strategy ) throw new Error(`invalid additional output strategy`)

  let outputs = []; 

  await Promise.all(strategy.outputs.map(async (output:any) => {

    let address;

    //Use vending machine owners account
    if( output.account_id === 0){

      address = await models.Address.findOne({ where: {account_id: vending_tx.account_id, currency:'BSV'}})

    }else{
   
      address = await models.Address.findOne({ where: {account_id: output.account_id, currency:'BSV'}})

    }

    let amount = (bsvToSend*output.scaler).toFixed(8)

    if( !address ) throw new Error(`BSV address is not set for all accounts in strategy ${strategy.id}`)
    
    let usd_amount = (await prices.convert({ currency: 'BSV', value: parseFloat(amount)}, 'USD')).value

    let vendingOutput = {
      vending_transaction_id: vending_tx.id,
      strategy_id : vending_tx.additional_output_strategy_id,
      isKioskCustomer: false,
      account_id: address.account_id,
      currency: 'BSV',
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

    outputs.push([address.value, amount])

  }));

  return outputs

}

export async function validateOutputs(outputs: any[][], vending_tx_id: number): Promise<boolean>{

  await Promise.all(outputs.map(async (output)=>{
    let record = await models.VendingTransactionOutput.findOne({
      where:{
        vending_transaction_id: vending_tx_id,
        address: output[0],
        hash:{
         [Op.is]: null
        }
      }
    })

    if(!record) throw new Error(`Invalid output vending_transaction_id: ${vending_tx_id} ${output[0]} ${output[1]}`)
   }));

 return true

}

export async function sendAdditionalOutputs(vendingTxid: number):Promise<any>{

  let vendingTx = await models.VendingTransaction.findOne({where:{id:vendingTxid}});

  let outputs = await getAdditionalOutputs(vendingTxid);

  let isValid = await validateOutputs(outputs, vendingTxid)

  if(!isValid) throw new Error(`invalid outputs`);

  let txid = await wallet.sendtomany(outputs);

  if( txid ){
 
    await vendingTx.update({
      additional_output_hash : txid 
    })

    await Promise.all(outputs.map(async (output)=>{

      let record = await models.VendingTransactionOutput.findOne({
        where:{
          vending_transaction_id: vendingTxid,
          address: output[0]
        }
      })

      await record.update({
        hash: txid,
        amount: output[1]
      })

   }))

  }

  return txid;

}
