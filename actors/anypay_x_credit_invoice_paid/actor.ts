/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {email, models} from '../../lib';
import {creditInvoice} from '../../lib/anypayx';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'anypay_x_credit_invoice_paid',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    let account = await models.Account.findOne({ where: { id: invoice.account_id }})

    if (account.should_settle) {

      await creditInvoice(uid)
    }

    channel.ack(msg);

  });


}

if (require.main === module) {

  start();

}
