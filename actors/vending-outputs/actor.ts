/* implements rabbi actor protocol */

require('dotenv').config();

import * as wallet from '../../plugins/bch/wallet';

import { Actor, Joi } from 'rabbi';

import {log, models} from '../../lib';

import * as amqp from 'amqplib';

const Op = require('sequelize').Op;


export async function start() {

  let conn = await amqp.connect(process.env.AMQP_URL)

  let chan = await conn.createChannel();

  setInterval( async ()=>{

    await chan.publish('anypay.events', 'outputs.retry.send', Buffer.from('outputs.retry.send'))        

  }, 3000)

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'outputs.retry.send',

    queue: 'outputs.retry.send',

  })  
  .start(async (channel, msg) => {

    log.info('outputs.retry.send')

    let txs = await models.VendingTransaction.findAll({ 
      where: {
        additional_output_strategy_id:{
          [Op.ne]:null
        },
        additional_output_hash:{
          [Op.is]:null
        }
      }
    })
    
    let txids = await Promise.all(txs.map(async(tx)=>{
     
      let outputs = await wallet.getAdditionalOutputs( tx.id ) 

      return await wallet.sendAdditionalOutputs( outputs, tx.id)

    }));
    
    log.info('txids sent:', txids);

    channel.ack(msg);

  }); 

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.VendingTransaction.afterCreate',

    queue: 'vending_outputs',

  })  
  .start(async (channel, msg) => {

    let vending_tx =  JSON.parse(msg.content) 

    log.info('vendingTransaction.afterCreate', vending_tx)

    if( vending_tx.status === 1 && vending_tx.type === 'BUY' && !vending_tx.additional_output_hash ){

      try{

        let outputs = await wallet.getAdditionalOutputs( vending_tx.id ) 

        let txid = await wallet.sendAdditionalOutputs( outputs, vending_tx.id)

        log.info(`vending.transaction.${vending_tx.id}.output.send txid: ${txid}`)

      }catch(err){
    
        log.info(`ERROR vending.transaction.${vending_tx.id}.output.send ${err}`)

      }
           
    }

    channel.ack(msg);

  }); 

}

if (require.main === module) {

  start();

}

