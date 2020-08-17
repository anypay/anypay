require('dotenv').config();

import { log, models } from '../../lib';

import {handlePayment, updateOutput} from '../../lib/payment_processor'

import { notify } from '../../lib/slack/notifier';

import { Actor } from 'rabbi';

async function start() {

  Actor.create({
    exchange: 'anypay.payments',
    routingkey: 'payment',
    queue: 'anypay:payments:received'
  })
  .start(async (channel, msg, payment) => {
    console.log('payment.received', JSON.stringify(payment));

    try {

      var invoice;
      
      invoice = await models.Invoice.findOne({
        where: {
          currency: payment.currency,
          address: payment.address,
          status: "unpaid"
        },
        order: [['createdAt', 'DESC']]
      });

      if (!invoice) {

        await updateOutput(payment)

        log.error('no unpaid invoice found matching currency and address');

        return channel.ack(msg);

      }

      let invoiceUID = invoice.uid;

      invoice = invoice.toJSON();

      invoice = await handlePayment(invoice, payment);

      log.info("invoices:paid", invoice.uid);

      await channel.publish('anypay:invoices', 'invoice:paid', new Buffer(invoice.uid));

      let account = await models.Account.findOne({
        where: {
          id: invoice.account_id
        }
      });

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      if (account.email !== 'diagnostic@anypayinc.com') {

        notify(
          `invoice.${invoice.status} ${account.email} ${invoice.currency} https://anypayapp.com/invoices/${invoice.uid}`
        );

      } 

      await channel.ack(msg);

    } catch(error) {

      log.error(error.message);

      await channel.ack(msg);

    }

  });

}

export {

  start

}

if (require.main === module) {

  start();

}


