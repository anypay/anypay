const BitcoinInvoice = require("../../../lib/bitcoin/invoice");
const Account = require("../../../lib/models/account");
const Boom = require('boom');
const Joi = require('joi');
import { setAddress } from '../../../lib/core';
import { AddressChangeSet } from '../../../lib/core/types/address_change_set';

import { models } from '../../../lib';

module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let account = await Account.find({ where: { id: accountId }})

  let addresses = {

    'BTC': account.bitcoin_payout_address,

    'DASH': account.dash_payout_address,

    'BCH': account.bitcoin_cash_address,

    'ZEC': account.zcash_t_address,

    'LTC': account.litecoin_address,

    'DOGE': account.dogecoin_address

  };

  let accountAddresses = await models.Address.findAll({

    where: { account_id: accountId }

  })
  
  accountAddresses.forEach(address => {

    addresses[address.currency] = address.value;

  });

  return addresses;

};

module.exports.update = async function(request, reply) {

  let currency = request.params.currency;

  let address = request.payload.address;

  let accountId = request.auth.credentials.accessToken.account_id;


  var changeset = {

    account_id: accountId,

    currency: currency.toUpperCase(),

    address: address

  };

  try {

    await setAddress(changeset);

    return {

      currency: changeset.currency,

      value: changeset.address

    }

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
