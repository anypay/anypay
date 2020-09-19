
require('dotenv').config()

import * as http from 'superagent';

import { models } from '../models'
import { fromSatoshis } from '../pay'

import * as qs from 'qs';

export async function generateCode(uid: string): Promise<string> {

  let paymentOption = await models.PaymentOption.findOne({
    where: {
      currency: 'DASH',
      invoice_uid: uid
    }
  })

  let amount = paymentOption.outputs.reduce((sum, output) => {

    return sum + output.amount 

  }, 0)

  let url = `https://api.anypayinc.com/r/${uid}`;

  console.log(url)

  let requestData = {
    token: process.env.DASHTEXT_TOKEN,
    url: `https://api.anypayinc.com/r/${uid}`,
    amount: amount.toString(), // convert to satoshis
    note: `Invoice ${uid}` 
  };

  let resp = await http
    .post('https://api.dashtext.io/apiurlbuy.php')
    .send(qs.stringify(requestData));

  return JSON.parse(resp.text);

}
