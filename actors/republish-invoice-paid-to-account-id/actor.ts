/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log, getChannel } from 'rabbi';

import { models } from '../../lib';
import { exchange, publish } from '../../lib/amqp';

export async function start() {

  let channel = await getChannel();

  await channel.assertExchange('account_events', 'topic');

  Actor.create({

    exchange,

    routingkey: 'invoice.paid',

    queue: 'republish_invoice_paid_as_account_id_dev'

  })
  .start(async (channel, msg, json) => {

    const { uid } = json
 
    let invoice = await models.Invoice.findOne({ where: { uid }});

    let routingKey1 = `accounts.${invoice.account_id}.invoicepaid`;
    let routingKey2 = `accounts.${invoice.account_id}.invoice.paid`;

    await channel.publish(routingKey1, msg.content);

    publish(routingKey2, invoice.toJSON())

  });

  Actor.create({

    exchange,

    routingkey: 'models.Invoice.afterCreate',

    queue: 'republish_invoice_created_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoicecreated`;

    await channel.publish(exchange, routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

  Actor.create({

    exchange,

    routingkey: 'models.Invoice.afterUpdate',

    queue: 'republish_invoice_updated_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoiceupdated`;

    await channel.publish(exchange, routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

}

if (require.main === module) {

  start();

}

