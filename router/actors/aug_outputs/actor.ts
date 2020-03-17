
import { Actor } from 'rabbi';

import * as Joi from 'joi';

import { sendAUGOnce } from '../../lib/rvn';

const exchange = 'anypay.router';

const routingkey = 'outputs.RVN/FREE_STATE_BANK/AUG';

const queue = 'outputs.send.RVN/FREE_STATE_BANK/AUG';

const schema = Joi.object().keys({

  uid: Joi.string().required(),

  address: Joi.string().required(),

  currency: Joi.string().required(),

  amount: Joi.number().required()

});

require('dotenv').config();

import { log } from '../../lib/logger';

async function start() {

  Actor.create({

    exchange,

    routingkey,

    queue

  })
  .start(async (channel, msg) => {

    var content;

    try {

      content = JSON.parse(msg.content.toString());

      log.info('outputs.send.RVN/FREE_STATE_BANK/AUG', content);

    } catch(error) {

      log.error(error.message);

      await channel.ack(msg);

      return;

    }

    const result = schema.validate(content);

    if (result.error) {

      log.error(`invalid schema ${result.error}`);

      await channel.ack(msg);

      return;

    }

    log.info('valid schema');

    if (content.currency !== 'RVN/FREE_STATE_BANK/AUG') {

      log.error('currency must be RVN/FREE_STATE_BANK/AUG');

      await channel.ack(msg);

      return;

    }

    /*
     * check to see payment already sent with given uid, which
     * should usually be a BSV transaction id.
     *
     */

    try {

      let resp = await sendAUGOnce(content.address, content.amount, content.uid);

      console.log(resp.toJSON());

    } catch(error) {

      console.error(error.message);

      /* send to back of queue */

      await channel.ack(msg);

      await channel.publish(exchange, routingkey, msg.content);

    }
  
  });

}

if (require.main === module) {

  start();

}

