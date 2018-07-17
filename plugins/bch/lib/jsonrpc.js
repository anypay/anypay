const http = require("superagent");

// make requests to bitcoin cash RPC interface

// BITCOINCASH_USER
// BITCOINCASH_PASSWORD
// BITCOINCASH_HOST

class JsonRpc {

  call(method, params) {
    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.BITCOINCASH_HOST}:8332`)
        .auth(process.env.BITCOINCASH_USER, process.env.BITCOINCASH_PASSWORD)
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

