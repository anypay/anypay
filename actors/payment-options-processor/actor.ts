require('dotenv').config();

import { Actor, Joi } from 'rabbi';
import { models, log, invoices } from '../../lib';

export async function start() {

  Actor
    .create({

      exchange: 'anypay.payments',

      routingkey: 'payment',

      queue: 'handle_payment_to_options'

    })
    .start(async (channel, msg, json) => {

      console.log('json', json);

      try {

        let option = await models.PaymentOption.findOne({ where: {

          currency: json.currency,

          address: json.address

        }});

        console.log(option);

        if (option) {

          let invoice = await models.Invoice.findOne({ where: {
            uid: option.invoice_uid
          }});

          if (option.currency !== invoice.currency) {

            await invoices.replaceInvoice(option.invoice_uid, option.currency);

            // process payment again through standard payment processor actor.
            await channel.publish('anypay.payments', 'payment', msg.content);

          }

        }

      } catch(error) {

        log.error(error.message);

      }

      await channel.ack(msg);

    });
}

if (require.main === module) {

  start();
}

