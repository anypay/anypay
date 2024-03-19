
import { setAddress } from '../../../lib/core';
import { log } from '../../../lib';

import { models } from '../../../lib';
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';
import { badRequest } from '@hapi/boom';
import prisma from '../../../lib/prisma';

import { addresses as Address } from '@prisma/client'

export async function destroy(request: AuthenticatedRequest, h: ResponseToolkit) {

  let address = await models.Address.findOne({ where: {
    account_id: request.account.id,
    currency: request.params.currency,
    chain: request.params.currency
  }})

  if (address) {
    await address.destroy()
  }

  return { success: true };

};

export async function list(request: AuthenticatedRequest, h: ResponseToolkit) {

  let addresses: {
    [key: string]: string
  
  } = {};

  const accountAddresses = await prisma.addresses.findMany({
    where: {
      account_id: request.account.id
    }
  })
  
  accountAddresses.forEach((address: Address) => {

    addresses[String(address.currency)] = String(address.value);

  });

  return addresses;

}

export async function index(request: AuthenticatedRequest, h: ResponseToolkit) {

  let addresses = await models.Address.findAll({

    where: { account_id: request.account.id }

  })
  
  return { addresses };

};

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    const { currency, chain, address } = request.payload as {
      currency: string,
      chain: string,
      address: string
    }

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

  } catch(error: any) {

    log.error('server.v0.handlers.addresses', error)

    return badRequest(error.message)

  }

}

export async function updateLegacy(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    const { currency } = request.params

    const { address } = request.payload as {
      address: string
    }

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

  } catch(error: any) {

    log.error('server.v0.handlers.addresses', error)

    return badRequest(error.message)

  }

}

