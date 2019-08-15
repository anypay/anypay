
require('dotenv').config()

import * as http from 'superagent';

import * as qs from 'qs';

export async function generateCode(address: string, amount: number, uid?: string): Promise<string> {

  let requestData = {
    token: process.env.DASHTEXT_TOKEN,
    address,
    amount: amount.toString(),
    note: "Invoice 4434"
  };

  /*
  if (uid) {

    requestData['note'] =  uid;

  }
  */

  let resp = await http
    .post('https://api.dashtext.io/apibuy.php')
    .send(qs.stringify(requestData));

  return JSON.parse(resp.text);

}
