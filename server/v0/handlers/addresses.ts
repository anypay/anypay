
const Boom = require('boom');
const Joi = require('joi');
import { setAddress } from '../../../lib/core';
import { log } from '../../../lib/log';

import { cleanObjectKeys as clean } from '../../../lib/utils'

import { models } from '../../../lib';

export async function remove(request, h) {

  let address = await models.Address.findOne({ where: {
    account_id: request.account.id,
    currency: request.params.currency
  }})

  if (address) {
    await address.destroy()
  }

  log.info('address.removed', { address: address.toJSON() })

  return { success: true }

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

  addresses = addresses.map(a => clean(a.toJSON()))
  
  return { addresses };

};

export async function update(request, h) {

  let { currency } = request.params;

  let { address } = request.payload;

  var changeset = {

    account_id: request.account.id,

    currency: currency.toUpperCase(),

    address

  };

  await setAddress(changeset);

  return h.response({

    currency: changeset.currency,

    value: changeset.address

  })

}

export const PayoutAddresses = Joi.object({
  BTC: Joi.string().optional(),
  BCH: Joi.string().optional(),
  BSV: Joi.string().optional(),
  LTC: Joi.string().optional(),
  DOGE: Joi.string().optional(),
  XMR: Joi.string().optional(),
  DASH: Joi.string().optional(),
  ETH: Joi.string().optional(),
  XRP: Joi.string().optional(),
  SOL: Joi.string().optional(),
}).label('Wallet Addresses');

export const PayoutAddressUpdate = Joi.object({
  address: Joi.string().required(),
}).label('Wallet Address Update');

export const schema = {

  Address: Joi.object({
    value: Joi.string().required(),
    id: Joi.number().required(),
    account_id: Joi.number().required(),
    currency: Joi.string().required(),
    paymail: Joi.string().optional(),
    note: Joi.string().optional(),
    locked: Joi.boolean().required(),
    price_scalar: Joi.number().optional(),
    nonce: Joi.number().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
  })

}

