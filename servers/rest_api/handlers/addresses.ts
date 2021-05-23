const BitcoinInvoice = require("../../../lib/bitcoin/invoice");

const Boom = require('boom');
const Joi = require('joi');
import { setAddress } from '../../../lib/core';
import { log } from '../../../lib';
import { AddressChangeSet } from '../../../lib/core/types/address_change_set';

import { models } from '../../../lib';

module.exports.delete = async function(req, h) {

  let address = await models.Address.findOne({ where: {
    account_id: req.account.id,
    currency: req.params.currency
  }})

  if (address) {
    await address.destroy()
  }

  return { success: true };

};


module.exports.list = async function(request, reply) {

  let accountId = request.auth.credentials.accessToken.account_id;

  let account = await models.Account.findOne({ where: { id: accountId }})

  let addresses = {};

  let accountAddresses = await models.Address.findAll({

    where: { account_id: accountId }

  })
  
  accountAddresses.forEach(address => {

    addresses[address.currency] = address.value;

  });

  return addresses;

};

export async function index(req, h) {

  let addresses = await models.Address.findAll({

    where: { account_id: req.account.id }

  })
  
  return { addresses };

};

module.exports.update = async function(request, reply) {

  console.log('update address');

  let currency = request.params.currency;

  let address = request.payload.address;

  let accountId = request.account.id;

  var changeset = {

    account_id: accountId,

    currency: currency.toUpperCase(),

    address: address

  };

  log.info('setaddress', changeset);

  try {

    await setAddress(changeset);

    return {

      currency: changeset.currency,

      value: changeset.address

    }

  } catch(error) {

    log.error(error)

    return Boom.badRequest(error);

  };

}

