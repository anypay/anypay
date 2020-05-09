require('dotenv').config();

var async = require("async");

import { log, models } from '../../lib';
import { publish } from '../../lib/amqp';

import { setPrice } from '../../lib/prices';

import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY;

export async function start() {

  setInterval(async () => {

     await publish('update_prices_usd');

  }, 1000 * 60 * 60); // every hour

  setInterval(async () => {

     await publish('update_prices_bch');
     await publish('update_prices_btc');
     await publish('update_prices_bsv');
     await publish('update_prices_dash');

  }, 1000 * 120); // every two minute

   await publish('update_prices_bch');
   await publish('update_prices_btc');
   await publish('update_prices_bsv');
   await publish('update_prices_dash');

}

if (require.main === module) {

  start();

}

