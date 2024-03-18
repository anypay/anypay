/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { models } from '../../lib';

import { sendMessage } from '../../lib/push_notifications';
import { exchange } from '../../lib/amqp';


export async function start() {

  Actor.create({

    exchange,

    routingkey: 'invoice:paid',

    queue: 'payment_push_notification'

  })
  .start(async (_, msg, json) => {

    log.info(msg.content.toString());

    const { uid } = json

    let invoice = await models.Invoice.findOne({ where: { uid }});

    let account = await models.Account.findOne({ where: { id: invoice.account_id }});

    if (!invoice) {
      return
    }

    try {

      await sendMessage(account.email, `Payment Received ${invoice.denomination_amount_paid} ${invoice.denomination_currency}`, invoice.currency, {
        path: `/payments/${uid}`,
      });

      return

    } catch(error) {

      log.error('actors.payment_push_notification', error);

    }

  });

}

if (require.main === module) {

  start();

}

