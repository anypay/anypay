const Blockcypher = require('./blockcypher');
const Account = require('../models/account');

module.exports.getNewAddress = async function getNewAddress(accountId) {

  let account = await Account.findOne({ where: { id: accountId }});

  let address = account.bitcoin_payout_address;

  if (!address) {
    throw new Error('no bitcoin BTC address set');
  }

  let paymentEndpoint = await Blockcypher.createPaymentEndpoint(merchantAddress);

  console.log('bitcoin address generated', paymentEndpoint);

  return paymentEndpoint.input_address;
}

