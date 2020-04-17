require('dotenv').config();

import * as http from 'superagent';

import { getAddressRoute } from '../../anypay-ach/lib/routes';

interface Address {
  currency: string;
  address: string
}

interface Route {
  input: Address; 
  output: Address; 
}

export function lookupOutputFromInput(currency: string, input_address: string):
  Promise<Route> {

    return getAddressRoute(input_address, currency);

  }

