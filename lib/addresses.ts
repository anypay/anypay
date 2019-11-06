
import { models } from './models';

import { setAddress } from './core';

export { setAddress }

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


export async function unsetAddress(changeset: AddressChangeSet): Promise<string> {

  let response  = await models.Address.destroy({
    where: {
      account_id: changeset.account_id,
      currency: changeset.currency,
      value: changeset.address
    }
  });

  return response;

};
