/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

import {email, models} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'send_invoice_paid_email_receipt',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    await email.invoicePaidEmail(invoice.toJSON());

  });

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'send_first_invoice_paid_email',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    let invoices = await models.Invoice.findAll({
      where: {
        account_id: invoice.account_id,
        status: 'paid'
      }
    })

    if (invoices.length === 1) {

      await email.firstInvoicePaidEmail(invoice.toJSON());

    }

  });


}

if (require.main === module) {

  start();

}
