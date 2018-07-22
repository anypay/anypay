const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
import * as Account from '../models/account';

const DashPrice = require('./price');

export async function getNewAddress(accountId) {

  let account = await Account.findOne({ where: { id: accountId }});

  let address = account.dash_payout_address;

  if (!address) {
    throw new Error('no DASH address set');
  }

  return Blockcypher.createPaymentEndpoint(address).then(paymentEndpoint => {

  	console.log('dash address generated', paymentEndpoint);

    return paymentEndpoint.input_address;
  });
}

