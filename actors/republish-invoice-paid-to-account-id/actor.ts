/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'republish_invoice_paid_as_invoice_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoicepaid`;

    await channel.publish('anypay.events', routingKey, msg.content);

    log.info(routingKey, { invoice: json });

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

