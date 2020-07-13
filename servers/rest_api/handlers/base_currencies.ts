
import { badRequest } from 'boom'

const Fixer = require('../../../lib/fixer');
import { getPriceOfOneDollarInVES } from '../../../lib/prices/ves';

export async function index(req, h) {

  try {

    var currencies = await Fixer.getCurrencies();

    var rates = currencies.rates;

    let vesPrice = ((await getPriceOfOneDollarInVES()) * currencies.rates['USD']);

    rates['VES'] = vesPrice;

    let sortedCurrencies = Object.keys(rates).sort();

    currencies.rates = sortedCurrencies.reduce((map, key) => {

      map[key] = rates[key];

      return map;

    }, {});

    return currencies;

  } catch(error) {

    return badRequest(error)

  }

}

