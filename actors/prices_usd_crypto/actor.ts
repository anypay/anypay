/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor } from 'rabbi';

import { amqp, log } from '../../lib';

import { getCryptoPrices } from '../../lib/prices/crypto';
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
    
    // DASH excluded because we use dashretail2 for DASH/USD price
    const coins = [
      'BSV',
      'BCH',
      'BTC'
    ];

    try {

      let prices = await getCryptoPrices('USD');

      prices.filter(price => {
        return coins.includes(price.symbol);
      })
      .map(price => {
        return {
          currency: price.symbol,
          base_currency: 'USD',
          value: 1 / price['quote']['USD']['price'],
          source: 'coinmarketcap.com'
        }
      })
      .map(price => {

        setPrice(price.currency, price.value, price.source, price.base_currency)
        setPrice(price.base_currency, 1 / price.value, price.source, price.currency);

        return price;

      })

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

