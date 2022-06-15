/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { ensureInvoice } from '../../lib/invoices'

import { getPayment } from '../../lib/payments'

import { getMiningFee } from '../../lib/fees'

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'cache_fees_after_payment'

  })
  .start(async (channel, msg, json) => {

    let uid = msg.content.toString();

    let invoice = await ensureInvoice(uid)

    let payment = await getPayment(invoice)

    log.info(invoice);

    console.log(payment.toJSON())

    let fee = await getMiningFee(payment.currency, payment.get('txhex'))

    console.log({ fee })

    await payment.set('total_input', fee.total_input)
    await payment.set('total_output', fee.total_output)
    await payment.set('network_fee', fee.network_fee)

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

