
require('dotenv').config()

import * as http from 'superagent';

export async function generateCode(address: string, amount: number, uid?: string): Promise<string> {

  let resp = await http
    .get('https://api.dashtext.io/apibuy.php')
    .send({
      token: process.env.DASHTEXT_TOKEN,
      address,
      amount,
      note: uid
    });

}
