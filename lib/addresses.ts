
import { log } from './log'

import { models } from './models'

import { setAddress as _setAddress } from './core'

import { convert } from './prices'

import { Orm } from './orm'

import { Account } from './account'

import { getCoins } from './coins'

interface Coin {
  code: string;
  chain: string;
  currency: string;
  name: string;
  enabled: boolean;
  supported: boolean;
  icon: string;
  address: string;
}

export async function listAddresses(account: Account): Promise<Coin[]> {

  let records = await models.Address.findAll({

    where: { account_id: account.id }

  })

  records = records.reduce((map, record) => {
    const code = `${record.currency}_${record.chain}`
    map[code] = record
    return map;
  }, {})

  let coins = await getCoins()

  return Promise.all(coins.map(async coin => {

    const code = `${coin.currency}_${coin.chain}`

    coin = {
      name: coin.name,
      code: code,
      chain: coin.chain,
      currency: coin.currency,
      logo: coin.logo_url,
      precision: coin.precision,
      enabled: coin.supported && !coin.unavailable,
      color: coin.color
    }

    let record = records[code]

    if (record) {

      coin.address = record.value
      coin.paymail = record.paymail
      coin.wallet = record.wallet
      coin.note = record.note
    }

    try {

      let { value: price } = await convert({ currency: coin.currency, value: 1 }, 'USD')

      coin['price'] = price

    } catch(error) {

    }

    return coin

  }))

}

export async function lockAddress(args: {account_id: number, currency: string, chain: string}) {

  const { account_id, chain, currency } = args

  let address = await models.Address.findOne({ where: {

    account_id,

    currency,
    
    chain

  }});

  if (!address) { 

    throw new Error('address not found');

  }

  address.locked = true;

  await address.save();

}

export async function unlockAddress(args: {account_id: number, currency: string, chain: string}) {

  const { chain, currency, account_id } = args

  let address = await models.Address.findOne({ where: {

    account_id,

    currency,

    chain

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

  constructor(account: Account, currency: string, chain: string) {
    this.message = `${currency} address not found for account ${account.id} on ${chain}`
  }
}

interface SetAddress {
  currency: string;
  chain: string;
  value: string;
  label?: string;
  view_key?: string;
  paymail?: string;
}

export async function setAddress(account: Account, params: SetAddress): Promise<Address> {

  let result: any = await _setAddress({
    address: params.value,
    currency: params.currency,
    chain: params.chain,
    view_key: params.view_key,
    account_id: account.id
  })

  return new Address(result)

}

export async function removeAddress(args: {account: Account, currency: string, chain: string}): Promise<void> {

  const { account, chain, currency } = args

  let record = await models.Address.findOne({ where: {

    account_id: account.id,

    currency: currency,

    chain: chain

  }})

  if (!record) {
    throw new Error('attempted to remove address that does not exist')
  }

  let address = record.toJSON()

  await record.destroy() 

  log.info('address.removed', address)

}

export async function findAddress(args: {account: Account, currency: string, chain: string}): Promise<Address> {

  const { account, chain, currency } = args

  let record = await models.Address.findOne({ where: {

    account_id: account.id,

    currency: currency,

    chain: chain

  }})

  if (!record) {

    throw new AddressNotFound(account, currency, chain)

  }

  return new Address(record)

}

export class Address extends Orm {

  static model = models.Address;

  get currency() {
    return this.get('currency')
  }

  get chain() {
    return this.get('chain')
  }

}

