require('dotenv');

import * as Boom from 'boom';
import { awaitChannel } from '../../../lib/amqp';
import { log } from '../../../lib/logger';
import { events } from '../../../lib';

import { notify } from '../../../lib/slack/notifier';

import { transformHexToPayments } from '../../../router/plugins/bsv/lib';

export async function create(req, h) {

  log.info('moneybutton.webhook', req.payload);

  try {

    const { secret, payment } = req.payload;

    await events.record({
      event: 'moneybutton.webhook',
      payload: req.payload
    })

    if (secret !== process.env.MONEYBUTTON_WEBHOOK_SECRET) {
      throw new Error('invalid moneybutton webhook secret');
    }

    const channel = await awaitChannel();

    notify(JSON.stringify({ event: 'moneybutton.webhook', payload: req.payload }), 'events')

    await channel.publish('anypay.events', 'moneybutton_webhook', Buffer.from(
      JSON.stringify(payment) 
    ))

    let payments = transformHexToPayments(payment.rawtx);

    payments.forEach(anypayPayment => {

      anypayPayment.invoice_uid = req.payload.payment.buttonId;

      if (req.payload.payment.buttonId) {

        log.info('anypay.payment', anypayPayment);

        channel.publish('anypay.payments', 'payment', Buffer.from(
          JSON.stringify(anypayPayment)
        ));

      }

    });

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

