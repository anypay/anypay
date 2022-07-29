/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

import {email} from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Account.afterCreate',

    queue: 'send_invoice_paid_email_receipt',

  })
  .start(async (channel, msg) => {

    let account = JSON.parse(msg.content.toString());

    await email.newAccountCreatedEmail(account);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}
