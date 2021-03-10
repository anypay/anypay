/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, log } from 'rabbi';

import { updateCryptoUSDPrice } from '../../lib/prices';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_ltc_prices',

    queue: 'update_ltc_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_ltc_prices', msg.content.toString());

    try {

      await updateCryptoUSDPrice('LTC');

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  console.log('start')
  start();

}

