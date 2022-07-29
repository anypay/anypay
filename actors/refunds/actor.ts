/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { models } from '../../lib/models'

export async function start() {

  // This actor should respond to invoice.paid events for invoices where
  // the app_id is set to the refunds app.

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'update_refund_paid',

  })
  .start(async (channel, msg) => {

    const uid = msg.content.toString()

    const refund = await models.Refund.findOne({

      where: {

        refund_invoice_uid: uid

      }
  
    })

    if (!refund || refund.status === 'paid') {

      channel.ack(msg);

      return

    }

    const original_invoice = await models.Invoice.findOne({

      where: { uid: refund.original_invoice_uid }

    })

    const refund_invoice = await models.Invoice.findOne({

      where: { uid }

    })

    refund.txid = refund_invoice.hash;

    refund.status = 'paid';

    await refund.save()

    log.info('refund.paid', Object.assign(refund.toJSON(), {
      account_id: original_invoice.account_id,
      invoice_uid: refund.original_invoice_uid
    }))

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

