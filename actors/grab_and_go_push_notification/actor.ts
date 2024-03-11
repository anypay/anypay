/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { models } from '../../lib';

import { sendMessage } from '../../lib/push_notifications';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'grab_and_go_payment_push_notification'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    let invoiceUid = msg.content.toString();

    let invoice = await models.Invoice.findOne({ where: { uid: invoiceUid }});

    let account = await models.Account.findOne({ where: { id: invoice.account_id }});

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

        await sendMessage(account.email, "Grab & Go Cashier-Less Payment", `$${invoice.denomination_amount_paid} | ${item.name}`, {
          path: `/payments/${invoiceUid}`,
        })

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

