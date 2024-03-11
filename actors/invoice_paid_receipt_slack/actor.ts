/* implements rabbi actor protocol */

require('dotenv').config();

import { notify } from '../../lib/slack/notifier';

import { Actor } from 'rabbi';

import { models} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay:invoices',

    routingkey: 'invoice:paid',

    queue: 'send_invoice_paid_slack_notify',

  })
  .start(async (channel, msg) => {

    let uid = msg.content.toString();

    let invoice = await models.Invoice.findOne({
 
      where: { uid: uid }

    });

    let account = await models.Account.findOne({
      where: { id: invoice.account_id }
    })

    var notificationMessage;

    if (account.business_name) {

      notificationMessage = `Payment to ${account.business_name} (${account.email}) for ${invoice.denomination_amount} ${invoice.denomination_currency} ${invoice.invoice_currency}`;

    } else {

      notificationMessage = `Payment to ${account.email} for ${invoice.denomination_amount} ${invoice.denomination_currency} ${invoice.invoice_currency}`;
    }

    if (invoice.is_public_request) {
      notificationMessage = `${notificationMessage} on Anypay City`
    }

    await notify(notificationMessage)

  });


}

if (require.main === module) {

  start();

}

