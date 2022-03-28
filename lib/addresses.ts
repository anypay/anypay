
import { models } from './models';

import { setAddress as _setAddress } from './core';

import { Orm } from './orm'

import { Account } from './account'

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

class AddressNotFound implements Error {
  name = 'AddressNotFound'
  message = 'address not found'

  constructor(account: Account, currency) {
    this.message = `${currency} address not found for account ${account.id}`
  }
}

interface SetAddress {
  currency: string;
  value: string;
  label?: string;
  view_key?: string;
  paymail?: string;
}

export async function setAddress(account: Account, params: SetAddress): Promise<Address> {

  let result: any = await _setAddress({
    address: params.value,
    currency: params.currency,
    view_key: params.view_key,
    account_id: account.id
  })

  return new Address(result)

}

export async function findAddress(account: Account, currency: string): Promise<Address> {

  let record = await models.Address.findOne({ where: {

    account_id: account.id,

    currency

  }})

  if (!record) {

    throw new AddressNotFound(account, currency)

  }

  return new Address(record)

}

export class Address extends Orm {

}

