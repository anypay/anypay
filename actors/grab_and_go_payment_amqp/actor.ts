/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { models } from '../../lib';

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
      return
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
          return
        }

        await channel.publish(
          'anypay.account_events',
          `accounts.${invoice.account_id}.grab_and_go.payment`,
          Buffer.from(JSON.stringify({
            amount: invoice.denomination_amount_paid,
            invoice_uid: invoiceUid,
            item_name: item.name
          }))
        );

        return

      } catch(error) {

        log.error('grab_and_go_payment_amqp', error);

      }

    }

  });

}

if (require.main === module) {

  start();

}

