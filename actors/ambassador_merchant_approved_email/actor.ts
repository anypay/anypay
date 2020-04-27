/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log, email } from 'rabbi';

import { models } from '../../lib/models';

export async function start() {

  Actor.create({

    exchange: 'anypay',

    routingkey: 'merchant_ambassador_approved',

    queue: 'merchant_ambassador_approved_email',

    schema: Joi.object({
      account_id: Joi.number().integer().required()
    }) // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    let businessAccount = await models.Account.findOne({
      where: { id: json.account_id }
    });

    let ambassadorAccount = await models.Account.findOne({
      where: { id: businessAccount.ambassador_id }
    });

    await email.sendEmail(
      'ambassador_merchant_approved_email',
      ambassadorAccount.email,
      'steven@anypayinc.com',
      {
        business: businessAccount.toJSON(),
        ambassador: ambassadorAccount.toJSON()
      }
    )
    
    log.info(msg.content.toString());

    log.info(json);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

