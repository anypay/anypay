require('dotenv').config();

const http = require('superagent');

var cache;

console.log('api key', process.env.COINMARKETCAP_API_KEY);

export async function getCryptoPrice(currency: string, base_currency: string) {
  let resp = await http
     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
     .query({
        start: 1,
        limit: 30,
        convert: base_currency
      })
      .set( 'X-CMC_PRO_API_KEY', process.env.COINMARKETCAP_API_KEY);

  return resp;


}

async function updateCurrencies() {

  let resp = await http
                     .get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest')
                     .query({
                        start: 1,
                        limit: 300,
                        convert: "BTC"
                      })
                      .set( 'X-CMC_PRO_API_KEY',process.env.COINMARKETCAP_PRO_API);

  cache = resp.body.data.reduce((accumulator, item) => {
      accumulator[item.symbol] = 1 / parseFloat(item.quote.BTC.price);
      return accumulator;
    }, {});

  return;
}

export function periodicallyUpdatePrices() {

  let interval = setInterval(async () => {
      console.log('update base currencies rates');
      await updateCurrencies();

  }, 1000 * 60 * 60 * 12); // every twelve hours

  return interval;

}

(async () => {

  await updateCurrencies();

})()

export async function getCryptoPrices() {

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

