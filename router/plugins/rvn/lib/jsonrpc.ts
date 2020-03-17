
require("dotenv").config();

import * as http from 'superagent';

async function rpcCall(method: string, params=[]) {

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

export {

  rpcCall

}
