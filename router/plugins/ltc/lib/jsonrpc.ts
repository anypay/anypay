
require("dotenv").config();

import * as http from 'superagent';

async function rpcCall(method: string, params=[]) {

  console.log("rpccall", {
    method, params 
  });

  try {

    let resp = await http
      .post(`https://${process.env.LTC_RPC_HOST}`)
      .auth(process.env.LTC_RPC_USER, process.env.LTC_RPC_PASSWORD)
      .send({
        method,
        params
      });

    console.log(resp);

    return resp.body.result;

  } catch(error) {

    console.error(error.message, error);

    throw error;

  }
}

export {

  rpcCall

}
