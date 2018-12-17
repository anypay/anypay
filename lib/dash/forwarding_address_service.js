const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
import * as Address from '../models/address';

const DashPrice = require('./price');

export async function getNewAddress(accountId) {

  let address = await Address.findOne({ where: { account_id: accountId, currency:'DASH' }});

  if (!address) {
    throw new Error('no DASH address set');
  }

  return Blockcypher.createPaymentEndpoint(address).then(paymentEndpoint => {

  	console.log('dash address generated', paymentEndpoint);

    return paymentEndpoint.input_address;
  });
}

