/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { notify } from '../../lib/rocketchat';
import { models } from '../../lib/models';
import { getBlockExplorerTxidUrl } from '../../lib/block_explorer';

export async function start() {

  console.log("STARTING EMAIL ACTOR");

  Actor.create({

    exchange: 'anypay',

    routingkey: 'ambassador_reward_paid',

    queue: 'ambassador_reward_rocketchat',

    schema: Joi.object({
      invoice_uid: Joi.string().required() 
    })

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());
    log.info(json);
    log.info(`invoice uid ${json.invoice_uid}`);

    let reward = await models.AmbassadorReward.findOne({
      where: { invoice_uid: json.invoice_uid }
    });

    let invoice = await models.Invoice.findOne({ where: {
      uid: reward.invoice_uid
    }});

    let account = await models.Account.findOne({ where: {
      id: invoice.account_id
    }});

    let ambassador = await models.Ambassador.findOne({ where: {
      id: account.ambassador_id
    }});

    let url = getBlockExplorerTxidUrl(reward);

    try {

      await notify('ambassdors', `ambassador reward sent for ${account.business_name} to ${ambassador.name} \n\n
        https://anypayapp.com/invoices/${reward.invoice_uid}\n\n${url}`);

    } catch(error) {

      log.error(error.message);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

