/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';
import { coins } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'activatecoin',

    queue: 'activate_coin'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());
    
    await coins.activateCoin(msg.content.toString());

    channel.ack(msg);

  });

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'deactivatecoin',

    queue: 'deactivate_coin'

  })
  .start(async (channel, msg) => {

    log.info(msg.content.toString());

    await coins.deactivateCoin(msg.content.toString());

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

