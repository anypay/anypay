/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log, getChannel } from 'rabbi';

import { models } from '../../lib';

export async function start() {

  let channel = await getChannel();

  await channel.assertExchange('account_events', 'topic');

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'republish_invoice_paid_as_account_id_dev'

  })
  .start(async (channel, msg) => {

    const uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid }});

    let routingKey1 = `accounts.${invoice.account_id}.invoicepaid`;
    let routingKey2 = `accounts.${invoice.account_id}.invoice.paid`;

    await channel.publish('anypay.events', routingKey1, msg.content);
    
    await channel.publish('anypay.account_events', routingKey2, Buffer.from(
      JSON.stringify(invoice.toJSON())
    ));

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'republish_invoice_created_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoicecreated`;

    await channel.publish('anypay.events', routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterUpdate',

    queue: 'republish_invoice_updated_as_account_id'

  })
  .start(async (channel, msg, json) => {

    let routingKey = `accounts.${json.account_id}.invoiceupdated`;

    await channel.publish('anypay.events', routingKey, msg.content);

    log.info(routingKey, { invoice: json });

  });

}

if (require.main === module) {

  start();

}

