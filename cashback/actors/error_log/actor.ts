/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import * as rocketchat from '../../lib/rocketchat';

export async function start() {

  Actor.create({

    exchange: 'anypay.cashback',

    routingkey: 'error',

    queue: 'simple_log_cashback_errors',

  })
  .start(async (channel, msg) => {

    let error = msg.content.toString();

    rocketchat.sendWebhook(`error|${error}`)

    log.info('cashback.error', error);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

