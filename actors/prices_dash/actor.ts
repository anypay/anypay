/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { prices } from '../../lib';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_dash_prices',

    queue: 'update_dash_prices'

  })
  .start(async (channel, msg) => {

    try {

      prices.updateDashPrices();

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

