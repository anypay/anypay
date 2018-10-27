import * as http from 'superagent';

import { log } from '../logger';

export async function getTickerAllCurrencies() {

  let response = await http.get('https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/')

  return JSON.parse(response.text);

}

export async function getVESPrice() {

  let allPrices = await getTickerAllCurrencies();

  return allPrices['VES']['avg_1h'];

}
