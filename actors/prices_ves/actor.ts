/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { amqp } from '../../lib';

import { getPriceOfOneDollarInVES } from '../../lib/prices/ves';
import { setPrice } from '../../lib/prices';

export async function start() {

  await amqp.publish('update_ves_prices');

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_ves_prices',

    queue: 'update_ves_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_ves_prices', msg.content.toString());

    try {

      let price = await getPriceOfOneDollarInVES();

      await setPrice('VES', price, 'dollartoday', 'USD');
      await setPrice('USD', 1 / price, 'dollartoday', 'VES');

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

