/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';
import { models } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'rabbi',

    routingkey: 'send_ambassador_reward',

    queue: 'send_ambassador_reward',

    schema: Joi.object().keys({
      invoice_uid: Joi.string().required()
    }) // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

    // get invoice from invoice uid
    let invoice = await models.Invoice.findOne({ where: {
      uid: json.invoice_uid
    }});

    // get account from invoice
    let account = await models.Account.findOne({ where: {
      id: invoice.account_id
    }});

    let claim = await models.AmbassadorClaim.findOne({
      where: {
        status: 'verified',
        merchant_account_id: account.id,
      }
    });

    if (!claim) {
      log.info(`no ambassador has claimed account ${account.id}`)
    }

    // get ambassador creditted for account
    let ambassador = await models.Ambassador.findOne({ where: {
      id: claim.ambassador.id
    }});

    let address = await models.Address.findOne({
      where: {
        account_id: ambassador.account_id,
        currency: invoice.currency
      }
    });

    // if ambassador, create ambassador reward record
    let [reward, isNew] = await models.AmbassadorRewarsd.findOrCreate({

      where: {
        invoice_uid: invoice.uid,
        ambassador_id: ambassador.id
      },

      defaults: {
        ambassador_id: ambassador.id,
        invoice_uid: invoice.uid,
        currency: address.currency,
        address: address.value,
        amount: invoice.amount_paid * 0.01
      }

    });

    if (isNew) {

      log.info('ambassador_reward.created', reward.toJSON());

    } else {

      log.info('ambassador_reward.already_created', reward.toJSON());

    }

    if (reward.hash) {

      await channel.ack(msg);

      return;

    }

    try {

      // send ambassador reward
      // send ambassador reward and update record
  
    } catch(error) {

      // update ambassador reward record with any failure
      reward.error = error.message;
      await reward.save();

    }

    await channel.ack(msg); 

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

