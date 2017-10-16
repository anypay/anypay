const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');

const BitcoinPrice = require('./price');

module.exports.getNewAddress = function getNewAddress(dollarAmount, merchantAddress) {

  return Blockcypher.createPaymentEndpoint(merchantAddress).then(paymentEndpoint => {

  	console.log('bitcoin address generated', paymentEndpoint);

    return paymentEndpoint.input_address;
  });
}
