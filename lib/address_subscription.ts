require('dotenv').config()


import * as http from 'superagent';

export async function createSubscription(currency, address){

  let callbackBase = process.env.API_BASE || 'https://api.anypayinc.com';

  let url = `${process.env.MONITOR_BASE}/v1/subscriptions`;

  if( currency === 'ZEC' ){

    url = `${process.env.ZEC_FORWARDER_BASE}/v1/subscriptions`;

  }

  console.log('subscription create url', url)

  let resp = await http.post(url).send({

    currency: currency,

    address: address,

    callback_url: `${callbackBase}/address_subscription_callbacks`

  });

  return resp.body.result;

}
