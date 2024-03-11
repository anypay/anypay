/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

import { models, slack } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'invoice_created_slack'

  })
  .start(async (channel, msg, json) => {

    let account = await models.Account.findOne({ where: { id: json.account_id }})

    slack.notify(`Invoice created by ${account.email} for ${json.denomination_amount} ${json.denomination_currency}`);

  });

}

if (require.main === module) {

  start();

}

