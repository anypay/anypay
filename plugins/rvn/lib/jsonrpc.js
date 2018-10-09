const http = require("superagent");

// make requests to bitcoin cash RPC interface

// RVN_USER
// RVN_PASSWORD
// RVN_HOST
// RVN_PORT

class JsonRpc {

  call(method, params) {
    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.RVN_RPC_HOST}:${process.env.RVN_RPC_PORT}`)
        .auth(process.env.RVN_RPC_USER, process.env.RVN_RPC_PASSWORD)
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

module.exports = JsonRpc;

