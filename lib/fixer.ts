
import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY

const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=usd`

var cache;

export interface Price {
  base_currency: string;
  currency: string;
  value: number;
  source: string;
}

export async function fetchCurrencies(base_currency): Promise<Price[]> {

  base_currency = base_currency.toLowerCase();

  const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=${base_currency}`;

  let response = await http.get(url);

  console.log(response)

  let rates = response.body.rates;

  return Object.keys(rates).map((currency) => {

     return {
       base_currency: base_currency.toUpperCase(),
       currency: currency,
       value: rates[currency],
       source: 'data.fixer.io/api/latest'
     }
  })

}

async function updateCurrencies() {

  let response = await http.get(url);

  cache = response.body;

  return;
}

setInterval(async () => {
    console.log('update base currencies rates');
    await updateCurrencies();

}, 1000 * 60 * 60 * 12); // every twelve hours

(async () => {

  await updateCurrencies();

})()

export async function getCurrencies() {

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

