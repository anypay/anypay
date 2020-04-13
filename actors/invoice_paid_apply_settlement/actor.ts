/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {email, models, settlements} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'apply_settlement_strategy_to_invoice',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    if (!invoice.should_settle) {
      return channel.ack(msg);
    }

    let account = await models.Account.findOne({
      where: { id: invoice.account_id }
    });

    if (!account.settlement_strategy) {
      return channel.ack(msg);
    }

    let strategy = settlements.findByName(account.settlement_strategy);

    await strategy.apply(invoice);

    channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}
