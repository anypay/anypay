const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");
const Boom = require('boom');
const Joi = require('joi');
import { setAddress } from '../../../lib/core';
import { AddressChangeSet } from '../../../lib/core/types/address_change_set';

module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let account = await Account.find({ where: { id: accountId }})

  return {
    'BTC': account.bitcoin_payout_address,
    'DASH': account.dash_payout_address,
    'BCH': account.bitcoin_cash_address,
    'ZEC': account.zcash_t_address
  };
};

module.exports.update = async function(request, reply) {
  let currency = request.params.currency;
  let address = request.payload.address;
  let accountId = request.auth.credentials.accessToken.account_id;

  let changeset = {
    account_id: accountId,
    currency: currency.toUpperCase(),
    address: address
  };

  try {

    await setAddress(changeset);

    let account = Account.findOne({ where: { id: accountId }}); 

    return account;

  } catch(error) {

    return Boom.badRequest('valid currency and address must be provided');

  };

}

module.exports.PayoutAddresses = Joi.object({
  BTC: Joi.string(),
  DASH: Joi.string(),
  BCH: Joi.string(),
}).label('PayoutAddresses');

module.exports.PayoutAddressUpdate = Joi.object({
  address: Joi.string().required(),
}).label('PayoutAddressUpdate');
