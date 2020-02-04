/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';
import { publishRabbi } from '../../lib/slack/events';

export async function start() {

  Actor.create({

    exchange: 'rabbi',

    routingkey: 'rabbi_planaria',

    queue: 'rabbi_planaria_log_events',

  })
  .start(async (channel, msg, json) => {

    if (json) {

      log.info(json);

    } else {

      log.info(msg.content.toString());

    }

    let result = await publishRabbi(msg.content.toString());

    console.log("RESULT", result);

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

