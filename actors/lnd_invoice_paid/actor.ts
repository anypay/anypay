/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models } from '../../lib'
import { logInfo } from '../../lib/logger'

import { completeLNPayment } from '../../lib/pay'

export async function start() {
  let invoices = await models.LightningInvoice.findAll()

  console.log('ALL LN', invoices)

  Actor.create({

    exchange: 'lnd',

    routingkey: 'invoice.paid',

    queue: 'lnd_invoice_paid',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    logInfo('lnd.invoice.paid', msg.content.toString());
    console.log(json);

    let lightningInvoice = await models.LightningInvoice.findOne({
      where: {
        payment_request: json.payment_request
      }
    })

    console.log('lightning invoice', lightningInvoice.toJSON)

    let paymentOption = await models.PaymentOption.findOne({
      where: { address: json.payment_request }
    })

    if (paymentOption) {
      console.log(paymentOption.toJSON())
      let result = await completeLNPayment(paymentOption, json.r_hash)
      console.log(result)
    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

