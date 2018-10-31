const http = require("superagent");

// make requests to bitcoin cash RPC interface

// ZEC_USER
// ZEC_PASSWORD
// ZEC_HOST
// ZEC_PORT

class JsonRpc {

  call(method, params) {
    return new Promise((resolve, reject) => {
      http
        .post(`http://${process.env.ZEC_RPC_HOST}:${process.env.ZEC_RPC_PORT}`)
        .auth(process.env.ZEC_RPC_USER, process.env.ZEC_RPC_PASSWORD)
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

    getAddress(address){
        return new Promise((resolve, reject) => {
          http
            .get('https://explorer.zecsystem.io/insight-api-zec/addr/'+address)
                .timeout({
                    response: 5000,
                    deadline: 10000,
                })
                .send().end((error, resp)=>{
                if (error) { return reject(error) }
                    resolve(resp.body);
                })

        })
    }
    getTransaction(tx){
        return new Promise((resolve,reject)=>{
           http
            .get('https://explorer.zecsystem.io/insight-api-zec/tx/'+tx)
                .timeout({
                    response: 5000,
                    deadline: 10000,
                })
                .send().end((err, resp)=>{
                if(err){
                    console.log(tx)
                    return reject(err)}
                    resolve(resp.body);
                })
        })

    }
}

module.exports = JsonRpc;

