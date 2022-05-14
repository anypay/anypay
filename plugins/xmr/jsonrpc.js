const http = require("superagent");

import { log } from '../../lib/log';

// make requests to bitcoin cash RPC interface

// XMR_USER
// XMR_PASSWORD
// XMR_HOST
// XMR_PORT

class JsonRpc {

  call(method, params) {

    log.info(`xmr.rpc.call.${method}`, params);

    return new Promise((resolve, reject) => {

      http
        .post(`http://${process.env.XMR_RPC_HOST}:${process.env.XMR_RPC_PORT}/json_rpc`)
        //.auth(process.env.XMR_RPC_USER, process.env.XMR_RPC_PASSWORD)
        .timeout({
          response: 5000,
          deadline: 10000,
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
