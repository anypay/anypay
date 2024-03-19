import { Request, ResponseToolkit } from "@hapi/hapi";

import * as Fixer from '../../../lib/prices/fixer'

export async function index(request: Request, h: ResponseToolkit) {

  var currencies = await Fixer.fetchCurrencies();

  return currencies;

}

