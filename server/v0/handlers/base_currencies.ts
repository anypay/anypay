
import { badRequest } from 'boom'

const Fixer = require('../../../lib/prices/fixer');

export async function index(req, h) {

  var currencies = await Fixer.getCurrencies();

  var rates = currencies.rates;

  let sortedCurrencies = Object.keys(rates).sort();

  currencies.rates = sortedCurrencies.reduce((map, key) => {

    map[key] = rates[key];

    return map;

  }, {});

  return currencies;

}

