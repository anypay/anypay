const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
const log = require('winston');

const LitecoinPrice = require('./price');

module.exports.getNewAddress = async function getNewAddress(dollarAmount, merchantAddress) {

  try {

    var paymentEndpoint = await Blockcypher.createPaymentEndpoint(merchantAddress)

    console.log('litecoin address generated', paymentEndpoint);

    return paymentEndpoint.input_address;

  } catch(error) {

    log.error('litecoin:blockcypher:payments:create', error.message);
    throw error;
  }
}
