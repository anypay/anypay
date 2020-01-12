/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

export async function start() {

  Actor.create({

    exchange: '',

    routingkey: '',

    queue: '',

    schema: Joi.object() // optional, enforces validity of json schema

  })
  .start(async (channel, msg, json) => {

    log.info(msg.content.toString());

    log.info(json);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

