

require("dotenv").config();

import * as http from 'superagent';

const models = require('../models');

async function rpc(method: string, params=[]) {

  try {

    let resp = await http
      .post(`http://${process.env.RVN_RPC_HOST}:${process.env.RVN_RPC_PORT}`)
      .auth(process.env.RVN_RPC_USER, process.env.RVN_RPC_PASSWORD)
      .send({
        method,
        params
      });

    return resp.body.result;

  } catch(error) {

    console.error(error.message, error.response.body.error.message);

    throw error;

  }
}

let cache = {}

export async function sendAUGOnce(address: string, amount: number, uid: string): Promise<any> {

  var record = await models.RouterTransaction.findOne({ where: {

    input_txid: uid 

  }});

  if (record) {

    console.log('router transaction exists');

  } else {

    let result = await rpc('transfer', [

      'FREE_STATE_BANK/AUG',

      amount,

      address
    
    ]);

    record = await models.RouterTransaction.create({

      input_txid: uid,

      output_txid: result[0],

      output_currency: 'RVN/FREE_STATE_BANK/AUG',

      output_amount: amount,

      output_address: address

    });

  }

  return record; 

}

export async function sendAUG(amount: number, address: string): Promise<string> {

  let result = await rpc('transfer', [

    'FREE_STATE_BANK/AUG',

    amount,

    address
  
  ]);

  return result[0];

}

export {

  rpc

}

