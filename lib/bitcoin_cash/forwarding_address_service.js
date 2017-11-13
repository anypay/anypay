const Invoice = require('../models/invoice');
const Features = require('../features');
const http = require('superagent');

const BitcoinCashPrice = require('./price');

const FORWADING_SERVICE_URL = process.env.FORWADING_SERVICE_URL || 'http://127.0.0.1:8000';

module.exports.getNewAddress = function getNewAddress(merchantAddress) {

  return new Promise((resolve, reject) => {
    if (!merchantAddress) {
      reject(new Error('merchant address not provided'));
    }

    if (!Features.isEnabled("BITCOINCASH")) {
      reject(new Error('Bitcoin Cash Not Enabled'));
    }

    http
      .post(`${FORWADING_SERVICE_URL}/payments`)
      .send({
        destination:  merchantAddress
      })
      .timeout({
        response: 5000,
        deadline: 10000
      })
      .end((error, response) => {
        if (error) {
          return reject(error);
        } else {
          if (response.body.input) {
            return resolve({
              input: response.body.input,
              destination: merchantAddress
            });
          } else {
            reject(new Error("invalid payment forwarding service response"));
          }
        }
      });
  });
}
