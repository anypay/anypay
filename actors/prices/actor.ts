require('dotenv').config();

var async = require("async");

import { log, models } from '../../lib';

import { getVESPrice } from '../../lib/prices/localbitcoins';
import { getPriceOfOneDASHInVES } from '../../lib/prices/ves';
import { getAllPrices } from '../../lib/prices';

import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY;

async function setPrice(currency, value) {

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

  return price

}

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

    await setPrice('VES', btcPrice);

  }

}

async function updateCryptos() {

  log.info('update crypto rates');

  let resp = await http
                     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
                     .query({
                        start: 1,
                        limit: 1000,
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

        await setPrice(currency, rates[currency]);

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

  }, 1000 * 60); // every minute

  setInterval(async () => {

      await updateVESPrice();

  }, 1000 * 60 * 60); // every hour

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
