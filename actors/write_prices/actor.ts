require('dotenv').config();

import { Actor, Joi } from 'rabbi';

import {models} from '../../lib';

//const datapay = require('datapay')

const privateKey = process.env.DATAPAY_PRIVATE_KEY;

const currencies = ['BSV', 'XAU', 'BTC', 'USD', 'BCH', 'DASH', 'RVN']

import * as moment from 'moment';

export async function start() {

  Actor.create({

    exchange: 'anypay.prices',

    routingkey: 'price.update',

    queue: 'write.prices.to.bsv',

    schema: Joi.object({

      currency: Joi.string(),

      base: Joi.string(),

      price: Joi.number()

    })


  })  
  .start(async (channel, msg, json) => {

    let found = currencies.find((elem)=>{
       return elem === json.currency || elem === json.base; 
    })

    if( found ){

      let price = await setPrice(json.currency, json.price, json.base);

      console.log(price)

                    /*      
      datapay.send({
        safe: true,
        data: ['188XPck5Fo2XwZv2Ktiz6PNYZAB76VBn9C', json.currency, json.base, json.price.toString(), moment().unix().toString()],
        pay: { key: privateKey }
      });
                     */
    }

    channel.ack(msg)

  })

}

if (require.main === module) {

  start();

}

export async function setPrice(currency, value, base_currency) {

  console.log("set price", currency, value, base_currency);

  let [price, isNew] = await models.Price.findOrCreate({

    where: {

      currency,

      base_currency

    },

    defaults: {

      currency,

      value,

      base_currency

    }
  });

  if (!isNew) {

    price.value = value;

    await price.save();

  }

  return price;

}

