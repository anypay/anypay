import { Request, ResponseToolkit } from "@hapi/hapi";

import * as Fixer from '@/lib/prices/fixer'
import AuthenticatedRequest from "@/server/auth/AuthenticatedRequest";

export async function index(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  var currencies = await Fixer.fetchCurrencies();

  return currencies;

}

