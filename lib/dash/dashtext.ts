
require('dotenv').config()

import * as http from 'superagent';

export async function generateCode(address: string, amount: number, uid?: string): Promise<string> {

  let requestData = {
    token: process.env.DASHTEXT_TOKEN,
    address,
    amount: amount.toString(),
    note: "Invoice 4434"
  };

  if (uid) {

    requestData['note'] =  uid;

  }

  console.log('requestData', requestData);

  let resp = await http
    .post('https://api.dashtext.io/apibuy.php')
    //.type('application/json')
    .send(JSON.stringify(requestData));

  return resp;

}
