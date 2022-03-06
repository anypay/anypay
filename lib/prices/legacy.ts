
const http = require('superagent');

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY

const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=btc`

var cache;

async function updateCurrencies() {

  let response = await http.get(url);

  cache = response.body.rates;

  return;
}

setInterval(async () => {
    await updateCurrencies();

}, 1000 * 60 * 60 * 12); // every twelve hours

(async () => {

  await updateCurrencies();

})()

async function getLegacyPrices() {

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

export { getLegacyPrices }
