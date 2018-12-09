const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
import * as Account from '../models/account';
import {models, xpub} from '../';
const Util = require('./extended_public_key_util');

const DashPrice = require('./price');

export async function getNewAddress(accountId) {

  let account = await Account.findOne({ where: { id: accountId }});

  let address = account.dash_payout_address;

  if (!address) {
    throw new Error('no DASH address set');
  }

  let xpubkey = await models.ExtendedPublicKey.findOne({ where: {

    account_id: account.id,

    currency: 'DASH'
    
  }});

  if (xpubkey) {

    address = await xpub.getNextAddress(xpubkey)

  }

  let paymentEndpoint = await  Blockcypher.createPaymentEndpoint(address);

  console.log('dash address generated', paymentEndpoint);

  return paymentEndpoint.input_address;
}

