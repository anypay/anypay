require('dotenv').config();

import * as http from 'superagent';

interface Address {
  currency: string;
  address: string
}

interface Route {
  input: Address; 
  output: Address; 
}

export async function lookupOutputFromInput(currency: string, input_address: string):
  Promise<Route> {

    console.log("LOOKUP", {
      currency, input_address
    })

    currency = currency.toUpperCase();

    let authVariable = `${currency}_ORACLE_ACCESS_TOKEN`;

    console.log('AUTH VARIABLE', authVariable);

    const api_base = process.env.API_BASE || 'https://api.anypay.global';

    let resp = await http
      .get(`${api_base}/address_routes/${currency}/${input_address}`)
      .auth(process.env[authVariable], '')

    return resp.body;

  }

