/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { ambassadorRewardEmail } from '../../lib/email';

export async function start() {

  console.log("STARTING EMAIL ACTOR");

  Actor.create({

    exchange: 'anypay',

    routingkey: 'ambassador_reward_paid',

    queue: 'ambassador_reward_email_receipt',

    schema: Joi.object({
      invoice_uid: Joi.string().required() 
    })

  })
  .start(async (channel, msg, json) => {

    log.info(json);

    try {

      log.info('ambassador_reward_email.send', json);

      let resp = await ambassadorRewardEmail(json.invoice_uid);

      log.info('ambassador_reward_email.sent', resp);

    } catch(error) {

      log.error(error.message);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

