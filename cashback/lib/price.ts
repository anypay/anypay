const http = require('superagent')

var dashDollarPrice;

var prices = {}

export async function convert(inputCurrencyAmount, outputCurrency) {

  const priceUrl = `https://api.anypay.global/convert/${inputCurrencyAmount.amount}-${inputCurrencyAmount.currency}/to-${outputCurrency}`;

  let response = await http.get(priceUrl);

  return response.body.conversion.output.value;

}

async function loadDollarPrice(currency: string) {

  const priceUrl = `https://api.anypay.global/convert/1-${currency}/to-USD`;

  let response = await http.get(priceUrl);

  prices[currency] = response.body.conversion.output.value;

  return;
}

export async function getDollarPrice(currency: string) { 

  if (!prices[currency]) {
    await loadDollarPrice(currency);
  }

  return prices[currency];
}

setInterval(function() {

  loadDollarPrice('DASH');
  loadDollarPrice('BCH');

}, 1000 * 60) // reload price every minute

