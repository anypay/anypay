/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

import { amqp, log } from '../../lib';

import { getCryptoPrices, updateCryptoUSDPrices } from '../../lib/prices/crypto';
import { setPrice } from '../../lib/prices';

export async function start() {

  await amqp.publish('update_usd_crypto_prices');

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_usd_crypto_prices',

    queue: 'update_usd_crypto_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_usd_crypto_prices', msg.content.toString());

    try {

      await updateCryptoUSDPrices();

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

