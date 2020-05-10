/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, amqp } from '../../lib';

import * as fixer from '../../lib/fixer';

import { setPrice } from '../../lib/prices';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_btc_prices',

    queue: 'update_btc_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_btc_prices', msg.content.toString());

    try {

      let prices = await fixer.fetchCurrencies('BTC');

      prices.forEach(async (price) => {

        let record = await setPrice(price.currency, price.value, price.source, price.base_currency);

      });

      prices.map(price => {

        return {
          base_currency: price.currency,
          currency: price.base_currency,
          value: 1 / price.value,
          source: price.source
        }
      })
      .forEach(async (price) => {

        let record = await setPrice(price.currency, price.value, price.source, price.base_currency);

      });

      let BTC_USD = await models.Price.findOne({
        where: {
          currency: 'BTC',
          base_currency: 'USD' 
        }
      });

      let USD_VES = await models.Price.findOne({
        where: {
          currency: 'USD',
          base_currency: 'VES' 
        }
      });

      let BTC_VES = BTC_USD.value * USD_VES.value;

      await setPrice('BTC', BTC_VES, 'dollartoday•coinmarketcap', 'VES');
      await setPrice('VES', 1 / BTC_VES, 'dollartoday•coinmarketcap', 'BTC');

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

