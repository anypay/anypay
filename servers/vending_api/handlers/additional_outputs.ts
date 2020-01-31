import { Request, ResponseToolkit } from 'hapi';

import * as amqp from 'amqplib';

import {log, models} from '../../../lib';

const Op = require('sequelize').Op;

export async function retry(req: Request, h: ResponseToolkit) {

  log.info('retry sending additional outputs');

  let conn = await amqp.connect(process.env.AMQP_URL)

  let chan = await conn.createChannel();

  await chan.publish('anypay.events', 'vending.additional.outputs.retry', Buffer.from('retru'))        

  return true;

}

export async function failures(req: Request, h: ResponseToolkit){

  let vending_transactions = await models.VendingTransaction.findAll({ 
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
 
  return {vending_transactions}

}
