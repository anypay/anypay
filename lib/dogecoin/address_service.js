const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
const log = require('winston');

const DogecoinPrice = require('./price');

module.exports.getNewAddress = async function getNewAddress(dollarAmount, merchantAddress) {

  try {

    var paymentEndpoint = await Blockcypher.createPaymentEndpoint(merchantAddress)

    console.log('dogecoin address generated', paymentEndpoint);

    return paymentEndpoint.input_address;

  } catch(error) {

    log.error('dogecoin:blockcypher:payments:create', error.message);
    throw error;
  }
}
