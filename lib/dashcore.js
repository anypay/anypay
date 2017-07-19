const PASSWORD = process.env.DASH_CORE_PASSWORD;
const USER = process.env.DASH_CORE_USER;
const http = require('superagent');

function getNewAddress() {
  let body = {"jsonrpc":"2.0","method":"getnewaddress","params":["0"], "id":1 };

  return new Promise((resolve, reject) => {
    http
      .post('https://dash.batm.anypay.global')	
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
					reject(error);
				} else {
					resolve(response.body.result);
				}
      });
  });
}

function sendPayment(address, amount) {

  let body = {
    "jsonrpc":"2.0",
    "method":"sendtoaddress",
    "params":[address, amount.toString()],
    "id":1
  };

  return new Promise((resolve, reject) => {

    http
      .post('https://dash.batm.anypay.global')
      .send(body)
      .auth(USER, PASSWORD)
      .end((error, response) => {
        if (error) {
					reject(error);
				} else {
					resolve(response.body.result);
				}
      });
  });
}

module.exports.sendPayment = sendPayment;

module.exports.getNewAddress = getNewAddress;

