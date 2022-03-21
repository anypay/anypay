const http = require("superagent");

import { log } from '../../../lib/log';

// make requests to bitcoin cash RPC interface

// BSV_USER
// BSV_PASSWORD
// BSV_HOST
// BSV_PORT

class JsonRpc {

  call(method, params) {

    log.info(`bsv.rpc.call.${method}`, params);

    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.BSV_RPC_HOST}:${process.env.BSV_RPC_PORT}`)
        .auth(process.env.BSV_RPC_USER, process.env.BSV_RPC_PASSWORD)
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
