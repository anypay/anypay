/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';


export async function start() {

  const emails = [
    "freshpress@anypay.global",
    "info@mnpastry.com"
  ];

  let accounts = await Promise.all(emails.map(async (email) => {

    let record = await Account.findOne({ where: { email }});

    return record;

  }))

  let ids = accounts.reduce((_ids, account) => {

    _ids[account.id] = account;

    return _ids;
  
  }, {});

  console.log(ids);

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'models.Invoice.afterCreate',

    queue: 'energycity_filter_invoice_after_create',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info('invoice', json);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

