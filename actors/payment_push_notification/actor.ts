/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, accounts } from '../../lib';

import { sendMessage } from '../../lib/push_notifications';


export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'payment_push_notification'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    let invoiceUid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid: invoiceUid }});

    let account = await models.Account.findOne({ where: { id: invoice.account_id }});

    if (!invoice) {
      return channel.ack(msg);
    }

    try {

      let resp = await sendMessage(account.email, `Payment Received ${invoice.denomination_amount_paid} ${invoice.denomination_currency}`, invoice.currency);

      console.log('firebase.notification.sent', resp);

      return channel.ack(msg);

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

