require('dotenv').config();

var async = require("async");

import { log, models } from '../../lib';
import { publish } from '../../lib/amqp';

import { getVESPrice } from '../../lib/prices/localbitcoins';
import { getPriceOfOneDASHInVES } from '../../lib/prices/ves';
import { getAllPrices, setPrice } from '../../lib/prices';

import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY;

async function updateVESPrice() {

  log.info('update VES price');

  let dashPrice = await getPriceOfOneDASHInVES();

  let allPrices = await getAllPrices();

  let btcPrice = dashPrice * allPrices['DASH'];

  if (btcPrice && btcPrice > 0) {

    await setPrice('VES', btcPrice, 'ves', 'BTC');

  }

}

async function updateDashPrices() {

  log.info('update DASH prices');

  let resp = await http.get('https://rates2.dashretail.org/rates?source=dashretail');

  let currencies = resp.body

  for (let i=0; i<currencies.length; i++) {

    let currency = currencies[i];

    if (currency.baseCurrency === 'DASH') {

      console.log({
        quote: currency.quoteCurrency,
        price: currency.price,
        base: currency.baseCurrency
      })

      setPrice('DASH', parseFloat(currency.price),
      'https://rates2.dashretail.org/rates?source=dashretail', currency.quoteCurrency);

    }

  }

}

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

