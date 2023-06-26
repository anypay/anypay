
import { setAddress } from '../../../lib/core';
import { log } from '../../../lib';

import { models } from '../../../lib';

export async function destroy(req, h) {

  let address = await models.Address.findOne({ where: {
    account_id: req.account.id,
    currency: req.params.currency,
    chain: req.params.currency
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

  try {

    const { currency, chain, address } = request.payload

    let accountId = request.account.id;

    var changeset = {

      account_id: accountId,

      currency: currency,

      chain: chain,

      address: address

    };

    log.info('address.update', changeset);

    await setAddress(changeset);

    return {

      currency: changeset.currency,

      chain: changeset.chain,

      value: changeset.address

    }

  } catch(error) {

    log.error('server.v0.handlers.addresses', error)

    return h.badRequest(error)

  }

}

export async function updateLegacy(request, h) {

  try {

    const { currency } = request.params

    const { address } = request.payload

    var changeset = {

      account_id: request.account.id,

      currency: currency,

      chain: currency,

      address

    };

    log.info('address.update', changeset);

    let result = await setAddress(changeset);

    return {
      currency,
      value: result.value
    }

  } catch(error) {

    log.error('server.v0.handlers.addresses', error)

    return h.badRequest(error)

  }

}

