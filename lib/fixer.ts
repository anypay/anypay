import {models} from './index';
import * as http from 'superagent';

const apiKey = process.env.ANYPAY_FIXER_ACCESS_KEY

const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&base=btc`

var cache;

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

module.exports.getCurrencies = async () => {

  if (!cache) {
    await updateCurrencies();
  }

  return cache;
}

