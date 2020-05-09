/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, amqp } from '../../lib';

import * as fixer from '../../lib/fixer';

import { setPrice, Price } from '../../lib/prices';
import { getCryptoPrice } from '../../lib/prices/crypto';

export async function start() {

  await amqp.publish('update_bch_prices');

  Actor.create({

    exchange: 'anypay',

    routingkey: 'update_bch_prices',

    queue: 'update_bch_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_bch_prices', msg.content.toString());

    let cryptoPrice = await getCryptoPrice('BCH', 'USD')

    console.log('CRYPTOPRICE', cryptoPrice);

    let BCH_USD_PRICE = await models.Price.findOne({
      where: {
        base_currency: 'USD',
        currency: 'BCH'
      }
    });

    console.log('BCH_USD_PRICE', BCH_USD_PRICE.value);

    try {

      let prices = await models.Price.findAll({
        where: {
          currency: 'USD'
        }
      });

      Promise.all(prices.map(async (price) => {

        let value = price.value / BCH_USD_PRICE.value

        let record = await setPrice('BCH', value, 'fixer•coinmarketcap', price.base_currency);

        return record;

      })).then(results => {

        results.map((price: Price) => {

          return {
            base_currency: price.currency,
            currency: price.base_currency,
            value: 1 / price.value,
            source: price.source
          }

        })
        .forEach(async (price) => {

          let record = await setPrice(price.currency, price.value, 'fixer•coinmarketcap', price.base_currency);

        });
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

