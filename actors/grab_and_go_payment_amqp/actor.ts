/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, accounts } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'grab_and_go_payment_amqp'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    let invoiceUid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid: invoiceUid }});

    if (!invoice) {
      return channel.ack(msg);
    }

    let grabAndGoInvoice = await models.GrabAndGoInvoice.findOne({

      where: {

        invoice_uid: invoiceUid

      }

    });

    if (grabAndGoInvoice) {

      try {

        let item = await models.GrabAndGoItem.findOne({ where: {
          id: grabAndGoInvoice.item_id
        }});

        if (!item) {
          return channel.ack(msg);
        }

        await channel.publish(
          'anypay.account_events',
          `accounts.${invoice.account_id}.grab_and_go.payment`,
          Buffer.from(JSON.stringify({
            amount: invoice.denomination_amount_paid,
            item_name: item.name
          }))
        );

        return channel.ack(msg);

      } catch(error) {

        console.log(error);

      }

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}
