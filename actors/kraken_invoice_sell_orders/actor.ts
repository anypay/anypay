
import { Actor } from 'rabbi';

import { log, kraken, models } from '../../lib';

import { publish } from '../../lib/amqp';

import * as cron from 'node-cron';

import * as http from 'superagent';

export async function start() {

  let account = await models.Account.findOne({ where: {

    email: 'dashsupport@egifter.com'

  }});

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'egifter_kraken_invoice_sell_order'

  })
  .start(async (channel, msg) => { 

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid }});

    if (invoice.account_id !== account.id) {

      return channel.ack(msg);
    }

    if (invoice.currency === 'DASH') {

      await models.KrakenInvoiceSellOrder.findOrCreate({

        where: {
          invoice_uid: uid
        },

        defaults: {
          invoice_uid: invoice.uid,
          invoice_currency: invoice.currency,
          invoice_amount_paid: invoice.invoice_amount_paid
        }

      });

    }

    channel.ack(msg);

  });

}


if (require.main === module) {

  start();

}

