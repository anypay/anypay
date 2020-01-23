require('dotenv').config()

import { log } from 'rabbi';

import * as http from "superagent";

class JsonRpc {

  call(method, params): Promise<any> {

    log.info(`dash.rpc.call.${method}`, params);

    return new Promise((resolve, reject) => {

      try {

        http
          .post(`http://${process.env.CASHBACK_DASH_RPC_HOST}:${process.env.CASHBACK_DASH_RPC_PORT}`)
          .auth(process.env.CASHBACK_DASH_RPC_USER, process.env.CASHBACK_DASH_RPC_PASSWORD)
          .timeout({
            response: 10000,  // Wait 5 seconds for the server to start sending,
            deadline: 10000, // but allow 1 minute for the file to finish loading.
          })
          .send({
            method: method,
            params: params || [],
            id: 0
          })
          .end((error, resp) => {

            if (error) { return reject(error) }

            if (resp.body.error) {

              reject(resp.body.error);

            } else {

              resolve(resp.body.result);
            }

          });
      } catch(error) {
        reject(error.response.body.error);
      }
    });
  }
}

let rpc = new JsonRpc();

export {
  rpc
}

