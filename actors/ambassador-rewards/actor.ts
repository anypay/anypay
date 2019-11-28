/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';
import { models } from '../../lib';
import * as cashbackDash from '../../plugins/dash/lib/cashback';
import * as bchrpc from '../../plugins/bch/lib/jsonrpc';

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

    if (!account.ambassador_id) {
      return channel.ack(msg);
    }

    let ambassador = await models.Ambassador.findOne({

      where: {

        id: account.ambassador_id

      }

    });

    let address = await models.Address.findOne({

      where: {

        account_id: ambassador.account_id,

        currency: invoice.currency

      }
    });

    // if ambassador, create ambassador reward record
    let [reward, isNew] = await models.AmbassadorReward.findOrCreate({

      where: {

        invoice_uid: invoice.uid,

        ambassador_id: ambassador.id

      },

      defaults: {

        ambassador_id: ambassador.id,

        invoice_uid: invoice.uid,

        currency: address.currency,

        address: address.value,

        amount: invoice.invoice_amount_paid * 0.01

      }

    });

    if (isNew) {

      log.info('ambassador_reward.created', reward.toJSON());

    } else {

      log.info('ambassador_reward.already_created', reward.toJSON());

    }

    if (reward.txid) {

      await channel.ack(msg);

      return;

    }

    try {

      if (invoice.currency === 'BCH') {

        // send ambassador reward and update record
        let resp = await bchrpc.rpc.call('sendtoaddress', [
          reward.address,
          parseFloat(reward.amount)
        ]);

        if (resp) {
          reward.txid = resp;
          await reward.save();
        }
    
      } else if (invoice.currency === 'DASH') {

        // send ambassador reward and update record
        let resp = await cashbackDash.sendToAddress(
          reward.address,
          parseFloat(reward.amount)
        );

        if (resp) {
          reward.txid = resp;
          await reward.save();
        }

      } else {

        throw new Error(`ambassador rewards for ${invoice.currency} not yet supported`);
      }
  
    } catch(error) {

      // update ambassador reward record with any failure
      reward.error = error.message;
      await reward.save();

    }

    await channel.ack(msg); 

  });

}

if (require.main === module) {

  start();

}

