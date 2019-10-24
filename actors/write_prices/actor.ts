require('dotenv').config();

import { Actor, Joi, log } from 'rabbi';

import {setPrice} from '../../lib/prices';

import {models} from '../../lib';

//const datapay = require('datapay')

const privateKey = process.env.DATAPAY_PRIVATE_KEY;

const currencies = ['BSV', 'XAU', 'BTC', 'USD', 'BCH', 'DASH', 'RVN']

import * as moment from 'moment';

export async function start() {

  Actor.create({

    exchange: 'anypay.prices',

    routingkey: 'price.update',

    queue: 'write.prices.to.database',

    schema: Joi.object({

      currency: Joi.string(),

      base: Joi.string(),

      price: Joi.number(),
 
      source: Joi.string()

    })


  })  
  .start(async (channel, msg, json) => {

    let found = currencies.find((elem)=>{
       return elem === json.currency || elem === json.base; 
    })

    if( found ){

      let price = await setPrice(json.currency, json.price, json.source,  json.base);

      log.info(price.toJSON())

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
