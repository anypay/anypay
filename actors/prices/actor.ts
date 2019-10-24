require('dotenv').config();

var async = require("async");

import { log, models } from '../../lib';

import { getVESPrice } from '../../lib/prices/localbitcoins';
import { getPriceOfOneDASHInVES } from '../../lib/prices/ves';
import { getAllPrices, setPrice } from '../../lib/prices';

import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY;


async function setPriceChuncks(currency, value, callback) {

  log.info("set price", currency, value)

  let [price, isNew] = await models.Price.findOrCreate({

    where: {

      currency

    },

    defaults: {

      currency,

      value

    }
  });

  if (!isNew) {

    price.value = value;

    await price.save();

  }

  callback(price)

}

async function updateVESPrice() {

  log.info('update VES price');

  let dashPrice = await getPriceOfOneDASHInVES();

  let allPrices = await getAllPrices();

  let btcPrice = dashPrice * allPrices['DASH'];

  if (btcPrice && btcPrice > 0) {

    await setPrice('VES', btcPrice, 'ves');

  }

}

async function updateDashPrices() {

  log.info('update DASH prices');

  let resp = await http.get('https://rates.dashretail.org/list');

  let currencies = Object.keys(resp.body);

  for (let i=0; i<currencies.length; i++) {

    let currency = currencies[i];

    let price = resp.body[currency];

    await setPrice(currency, price, 'dashretail', 'DASH');

  }

}

async function updateCryptos() {

  log.info('update crypto rates');

  let resp = await http
                     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
                     .query({
                        start: 1,
                        limit: 300,
                        convert: "BTC"
                      })
                      .set( 'X-CMC_PRO_API_KEY',process.env.COINMARKETCAP_API_KEY);
  
  async.eachLimit(resp.body.data, 10, (item,callback)=>{  

    setPriceChuncks(item.symbol, 1 / parseFloat(item.quote.BTC.price), (res)=>{

      callback();

    })  

  })
  
}

async function updateFiatCurrencies() {

  log.info('update base currencies rates');

  let url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=btc`;

  let response = await http.get(url);

  if (response.body.success) {

    let rates = response.body.rates;

    let currencies = Object.keys(rates);

    for (let i=0; i < currencies.length; i++) {

      let currency = currencies[i];


      if (rates[currency] > 0) {

        await setPrice(currency, rates[currency],'fixer');

      }

    }

  }

  return;
}

async function start() {

  setInterval(async () => {

      await updateFiatCurrencies();

  }, 1000 * 60 * 60); // every hour

  setInterval(async () => {

      await updateCryptos();

  }, 1000 * 120); // every two minute

  setInterval(async () => {

      await updateDashPrices();

  }, 1000 * 300); // every five minutes

  setInterval(async () => {

      await updateVESPrice();

  }, 1000 * 60 * 60); // every hour

  await updateDashPrices();

  await updateFiatCurrencies();

  await updateCryptos();

  await updateVESPrice();

}

if (require.main === module) {

  start();

}

export {
  start
}
