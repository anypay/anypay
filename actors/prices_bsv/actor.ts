/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, amqp } from '../../lib';

import * as fixer from '../../lib/fixer';

import { setPrice, Price } from '../../lib/prices';

export async function start() {

  Actor.create({

    exchange: 'anypay.events',

    routingkey: 'update_bsv_prices',

    queue: 'update_bsv_prices'

  })
  .start(async (channel, msg) => {

    log.info('update_bsv_prices', msg.content.toString());

    let BSV_USD_PRICE = await models.Price.findOne({
      where: {
        base_currency: 'USD',
        currency: 'BSV'
      }
    });

    console.log('BSV_USD_PRICE', BSV_USD_PRICE.value);

    try {

      let prices = await models.Price.findAll({
        where: {
          currency: 'USD'
        }
      });

      prices.map(async (price) => {

        let value = price.value * BSV_USD_PRICE.value

        await setPrice('BSV', value, 'fixer•coinmarketcap', price.base_currency);
        await setPrice(price.base_currency, 1 / value, 'fixer•coinmarketcap', 'BSV');

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

