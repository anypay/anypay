/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { ensureInvoice } from '../../lib/invoices'

import { getPayment } from '../../lib/payments'

import { getMiningFee } from '../../lib/fees'
import { exchange } from '../../lib/amqp';

export async function start() {
``
  Actor.create({

    exchange,

    routingkey: 'invoice:paid',

    queue: 'cache_fees_after_payment'

  })
  .start(async (_, msg, json) => {

    let uid = msg.content.toString();

    let invoice = await ensureInvoice(uid)

    let payment = await getPayment(invoice)

    log.info(invoice);

    let fee = await getMiningFee(payment.currency, payment.get('txhex'))

    await payment.set('total_input', fee.total_input)
    await payment.set('total_output', fee.total_output)
    await payment.set('network_fee', fee.network_fee)

  });

}

if (require.main === module) {

  start();

}

