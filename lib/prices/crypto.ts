
const http = require('superagent');

var cache;

async function updateCurrencies() {

  let resp = await http.get('https://api.coinmarketcap.com/v1/ticker');

  cache = resp.body.reduce((accumulator, item) => {
      accumulator[item.symbol] = 1 / parseFloat(item.price_btc);
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

