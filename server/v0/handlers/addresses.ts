
const Boom = require('boom');
const Joi = require('joi');
import { setAddress } from '../../../lib/core';
import { log } from '../../../lib';

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

export async function list(request, h) {

  let addresses = {};

  let accountAddresses = await models.Address.findAll({

    where: { account_id: request.account.id }

  })
  
  accountAddresses.forEach(address => {

    addresses[address.currency] = address.value;

  });

  return addresses;

}

export async function index(req, h) {

  let addresses = await models.Address.findAll({

    where: { account_id: req.account.id }

  })
  
  return { addresses };

};

export async function update(request, h) {

  let currency = request.params.currency;

  let address = request.payload.address;

  let accountId = request.account.id;

  var changeset = {

    account_id: accountId,

    currency: currency.toUpperCase(),

    address: address

  };

  log.info('address.update', changeset);

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

export const PayoutAddresses = Joi.object({
  BTC: Joi.string().optional(),
  DASH: Joi.string(),
  BCH: Joi.string(),
}).label('Addresses');

export const PayoutAddressUpdate = Joi.object({
  address: Joi.string().required(),
}).label('PayoutAddressUpdate');

