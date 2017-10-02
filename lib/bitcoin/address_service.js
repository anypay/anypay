const Blockcypher = require('./blockcypher');
const Invoice = require('./models/invoice');

const BitcoinPrice = require('./bitcoin/price');

module.exports.getNewAddress = function getNewAddress(dollarAmount, merchantAddress) {

  return Blockcypher.createPaymentEndpoint(merchantAddress).then(address => {

  	console.log('bitcoin address generated', address);

    return address;
  });
}
