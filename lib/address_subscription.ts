require('dotenv').config()


import * as http from 'superagent';

export async function createSubscription(currency, address){

  let callbackBase = process.env.API_BASE || 'https://api.anypay.global';

  let url = `${process.env.MONITOR_BASE}/v1/subscriptions`;

  let resp = await http.post(url).send({

    currency: currency,

    address: address,

    callback_url: `${callbackBase}/address_subscription_callbacks`

  });

  return resp.body.result;

}
