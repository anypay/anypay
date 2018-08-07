const http = require("superagent");

// make requests to bitcoin cash RPC interface

// ZEN_USER
// ZEN_PASSWORD
// ZEN_HOST
// ZEN_PORT

class JsonRpc {

  call(method, params) {
    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.ZEN_RPC_HOST}:${process.env.ZEN_RPC_PORT}`)
        .auth(process.env.ZEN_RPC_USER, process.env.ZEN_RPC_PASSWORD)
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

