/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log, email } from 'rabbi';
import { models } from '../../lib/models';

export async function start() {

  Actor.create({

    exchange: 'anypay',

    routingkey: 'ambassador_claim_created',

    queue: 'ambassador_claim_created_email_sudo',

    schema: Joi.object().keys({
      account_id: Joi.number().integer().required()
    })// optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

    let account = await models.Account.findOne({ where: {
      id: json.account_id
    }});

    console.log(account.toJSON());

    let ambassadorAccount = await models.Account.findOne({ where: {
      id: account.ambassador_id
    }});

    let ambassador = await models.Ambassador.findOne({ where: {
      account_id: ambassadorAccount.id
    }});

    await email.sendEmail(
      'ambassador_selected_sudo_email',
      'steven@anypayinc.com',
      'sudo@anypayinc.com',
      {
        account: account.toJSON(),
        ambassador: ambassador.toJSON()
      }
    )

    await email.sendEmail(
      'ambassador_selected_sudo_email',
      'derrick@anypayinc.com',
      'sudo@anypayinc.com',
      {
        account: account.toJSON(),
        ambassador: ambassador.toJSON()
      }
    )


    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

