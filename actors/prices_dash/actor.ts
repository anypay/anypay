/* implements rabbi actor protocol */

require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import { models, amqp, prices } from '../../lib';

import * as http from 'superagent';

export async function start() {

  await amqp.publish('update_prices_dash');

  Actor.create({

    exchange: 'anypay',

    routingkey: 'update_prices_dash',

    queue: 'update_prices_dash'

  })
  .start(async (channel, msg) => {

    try {

      let resp = await http.get('https://rates2.dashretail.org/rates?source=dashretail');

      let currencies = resp.body

      for (let i=0; i<currencies.length; i++) {

        let currency = currencies[i];

        if (currency.baseCurrency === 'DASH') {

          console.log({
            base_currency: currency.baseCurrency,
            currency: currency.quoteCurrency,
            amount: parseFloat(currency.price),
            source: 'rates2.dashretail.org/rates?source=dashretail'
          })

          prices.setPrice(
            currency.quoteCurrency,
            parseFloat(currency.price),
            'https://rates2.dashretail.org/rates?source=dashretail',
            currency.baseCurrency
          );

          let price=  {
            base_currency: currency.quoteCurrency,
            currency: currency.baseCurrency,
            value: 1 / parseFloat(currency.price),
            source: 'rates2.dashretail.org/rates?source=dashretail'
          }

          console.log(price);

          prices.setPrice(
            price.currency,
            price.value,
            price.source,
            price.base_currency
          );

        }

      }

    } catch(error) {

      console.log(error);

    }

    channel.ack(msg);

  });

}

if (require.main === module) {

  start();

}

