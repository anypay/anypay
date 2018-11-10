const Blockcypher = require('./blockcypher');
const Invoice = require('../models/invoice');
import * as Account from '../models/account';
import {models} from '../';
const Util = require('./extended_public_key_util');

const DashPrice = require('./price');

export async function getNewAddress(accountId) {

  let account = await Account.findOne({ where: { id: accountId }});

  let address = account.dash_payout_address;

  if (!address) {
    throw new Error('no DASH address set');
  }

  let xpub = await models.ExtendedPublicKey.findOne({ where: {

    account_id: account.id
    
  }});

  if (xpub) {

    address = Util.generate(xpub.xpubkey, `m/0/${xpub.nonce}`);

    xpub.nonce = xpub.nonce + 1;

    await xpub.save();

  }


  return Blockcypher.createPaymentEndpoint(address).then(paymentEndpoint => {

  	console.log('dash address generated', paymentEndpoint);

    return paymentEndpoint.input_address;
  });
}

