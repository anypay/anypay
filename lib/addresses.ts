
import { models } from './models';

import { setAddress, unsetAddress } from './core';

export { setAddress, unsetAddress }

import {
  AddressChangeSet,
  DenominationChangeset
} from './core/types/address_change_set';


export async function lockAddress(accountId: number, currency: string) {

  let address = await models.Address.findOne({ where: {

    account_id: accountId,

    currency

  }});

  if (!address) { 

    throw new Error('address not found');

  }

  address.locked = true;

  await address.save();

}

export async function unlockAddress(accountId: number, currency: string) {

  let address = await models.Address.findOne({ where: {

    account_id: accountId,

    currency

  }});

  if (!address) { 

    throw new Error('address not found');

  }

  address.locked = false;

  await address.save();

}
