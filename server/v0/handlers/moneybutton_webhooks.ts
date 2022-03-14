require('dotenv');

import * as Boom from 'boom';
import { awaitChannel } from '../../../lib/amqp';

import { events, log } from '../../../lib';

import * as bsv from 'bsv';

import { notify } from '../../../lib/slack/notifier';

import { submitPayment, SubmitPaymentResponse } from '../../payment_requests/handlers/json_payment_requests';

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

    let response: SubmitPaymentResponse = await submitPayment({
      transactions: [payment.rawtx],
      currency: 'BSV',
      invoice_uid: req.payload.payment.buttonId
    })

    log.info('bsv.bip270.broadcast.success', {
      headers: req.headers,
      payload: req.payload,
      response
    })

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

