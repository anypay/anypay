
import { fetchCurrencies } from '../../../lib/prices/fixer'

export async function index(h) {

  var currencies = await fetchCurrencies();

  return currencies

}

