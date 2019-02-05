
const http = require('superagent');

var cache;

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

setInterval(async () => {
    console.log('update base currencies rates');
    await updateCurrencies();

}, 1000 * 60 * 60 * 12); // every twelve hours

(async () => {

  await updateCurrencies();

})()

export async function getCryptoPrices() {

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

