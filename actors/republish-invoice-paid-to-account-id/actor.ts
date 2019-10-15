/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'republish_invoice_paid_as_account_id'

  })
  .start(async (channel, msg) => {

    const uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid }});

    let routingKey = `accounts.${invoice.account_id}.invoicepaid`;

    await channel.publish('anypay.events', routingKey, msg.content);

    log.info(routingKey, { invoice: invoice.toJSON() });

    channel.ack(msg);

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

    channel.ack(msg);

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

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

