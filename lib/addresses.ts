
import { log } from './log'

import * as bsv from 'bsv';

import { plugins } from './plugins';

import { models } from './models'

import { convert } from './prices'

import { Orm } from './orm'

import { Account } from './account'

import { getCoins } from './coins'

interface Coin {
  code: string;
  currency: string;
  name: string;
  enabled: boolean;
  supported: boolean;
  icon: string;
  address: string;
}

interface AddressChangeSet {
  account_id: number;
  currency: string;
  address: string;
  metadata?: string;
  paymail?: string;
  view_key?: string;
  address_id?: number;
}


async function _setAddress(changeset: AddressChangeSet): Promise<any> {

  var isValid = true;

  let plugin = await plugins.findForCurrency(changeset.currency);

  let paymail = await getPaymail(changeset.currency, changeset.address);

  changeset.paymail = paymail;

  if (plugin.transformAddress) {

    changeset.address = await plugin.transformAddress(changeset.address);

  }

  if (plugin.validateAddress) {

    isValid = await plugin.validateAddress(changeset.address);

  }


  if(!isValid){
  
    throw(`invalid ${changeset.currency} address`)

  }

  var address = await models.Address.findOne({ where: {
    account_id: changeset.account_id,
    currency: changeset.currency
  }});

  if (address) {

    if (address.locked) {

      throw new Error(`${changeset.currency} address locked`);

    }

    await address.update({
      value: changeset.address,
      paymail: changeset.paymail,
      view_key: changeset.view_key,
      note: null
    });

  } else {

    address = await models.Address.create({
      account_id: changeset.account_id,
      currency: changeset.currency,
      value: changeset.address,
      view_key: changeset.view_key,
      paymail: changeset.paymail
    });

  }

  changeset.address_id = address.id;

  log.info('address.set', changeset)

  return address;

};

import {getPaymail as bsvGetPaymail} from '../plugins/bsv';

async  function getPaymail(currency, address) {

  if (currency !== 'BSV') {
    return null;
  }

  let paymail = await bsvGetPaymail(address);

  if (paymail) {

    try {

      new bsv.Address(address); 

      return null;

    } catch(error) {

      return address;

    }

  }

}

export async function listAddresses(account: Account): Promise<Coin[]> {

  let records = await models.Address.findAll({

    where: { account_id: account.id }

  })

  records = records.reduce((map, record) => {
    map[record.currency] = record
    return map;
  }, {})

  let coins = await getCoins()

  return Promise.all(coins.map(async coin => {

    coin = {
      name: coin.name,
      code: coin.code,
      logo: coin.logo_url,
      precision: coin.precision,
      enabled: coin.supported && !coin.unavailable,
      color: coin.color
    }

    let record = records[coin.code]

    if (record) {

      coin.address = record.value
      coin.paymail = record.paymail
      coin.wallet = record.wallet
      coin.note = record.note
    }

    try {

      let { value: price } = await convert({ currency: coin.code, value: 1 }, 'USD')

      coin['price'] = price

    } catch(error) {

    }

    return coin

  }))

}

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

export async function removeAddress(account: Account, currency: string): Promise<void> {

  const account_id = account.id

  console.log('remove_address', { account_id, currency }) 

  let record = await models.Address.findOne({ where: {

    account_id,

    currency

  }})

  if (!record) {
    throw new Error('attempted to remove address that does not exist')
  }

  let address = record.toJSON()

  await record.destroy() 

  log.info('address.removed', address)

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

