const http = require("superagent");

import { log } from '../../../lib/logger';

// make requests to bitcoin cash RPC interface

// BTC_USER
// BTC_PASSWORD
// BTC_HOST
// BTC_PORT

class JsonRpc {

  call(method, params) {

    log.info(`bsv.rpc.call.${method}`, params);

    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.BTC_RPC_HOST}:${process.env.BTC_RPC_PORT}`)
        .auth(process.env.BTC_RPC_USER, process.env.BTC_RPC_PASSWORD)
        .timeout({
          response: 5000,  // Wait 5 seconds for the server to start sending,
          deadline: 10000, // but allow 1 minute for the file to finish loading.
        })
        .send({
          method: method,
          params: params || [],
          id: 0
        })
        .end((error, resp) => {
          if (error) { return reject(error) }
          resolve(resp.body);
        });
    });
  }
}

let rpc = new JsonRpc();

export {
  rpc
}
