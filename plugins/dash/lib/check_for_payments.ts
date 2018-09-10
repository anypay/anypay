require('dotenv').config();

import * as http from 'superagent';

let token = process.env.BLOCKCYPHER_TOKEN;

async function getAddressBalance(address: string) {

  let resp = await http.get(`https://api.blockcypher.com/v1/dash/main/addrs/${address}?token=${token}`)

  return resp.body;
}

export async function checkAddressForPayments(address: string) {

  let balance = await getAddressBalance(address);

  return balance;

}

