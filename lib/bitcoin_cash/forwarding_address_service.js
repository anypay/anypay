const Invoice = require('../models/invoice');
const Features = require('../features');

const BitcoinCashPrice = require('./price');

module.exports.getNewAddress = function getNewAddress(dollarAmount, merchantAddress) {

  if (!Features.isEnabled("BITCOINCASH")) {
    return Promise.reject(new Error('Bitcoin Cash Not Enabled'));
  }

  /* AnypayForwarder

    Here generate a forwarding address using the Anypay Payment Forwarder service

    return new Promise();
  */ 
}
