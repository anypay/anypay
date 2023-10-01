
import { log } from './log'

import { setAddress as _setAddress } from './core'

import { convert } from './prices'

import { Account } from './account'

import { getCoins } from './coins'

import { accounts, addresses, coins } from '@prisma/client'

import { prisma } from './prisma'

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

export async function listAddresses(account: Account): Promise<coins[]> {

  let records = await prisma.addresses.findMany({
    where: { account_id: account.id }
  })

  const addressesRecords = records.reduce((map: any, record: addresses) => {
    const code = `${record.currency}_${record.chain}`
    map[code] = record
    return map;
  }, {})

  let coins = await getCoins()

  return Promise.all(coins.map(async coin => {

    const code: string = `${coin.currency}_${coin.chain}`

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

    let record = addressesRecords[code]

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

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id,
      currency,
      chain
    }
  })

  await prisma.addresses.update({
    where: { id: address.id },
    data: { locked: true }
  })

}

export async function unlockAddress(args: {account_id: number, currency: string, chain: string}) {

  const { chain, currency, account_id } = args

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id,
      currency,
      chain
    }
  })

  await prisma.addresses.update({
    where: { id: address.id },
    data: { locked: false }
  })

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

export async function setAddress(account: accounts, params: SetAddress): Promise<addresses> {

  return  _setAddress({
    address: params.value,
    currency: params.currency,
    chain: params.chain,
    view_key: params.view_key,
    account_id: account.id
  })

}

export async function removeAddress(args: {account: Account, currency: string, chain: string}): Promise<void> {

  const { account, chain, currency } = args

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id: account.id,
      currency,
      chain
    }
  })

  await prisma.addresses.delete({
    where: { id: address.id }
  })

  log.info('address.removed', address)

}

export async function findAddress(args: {account: Account, currency: string, chain: string}): Promise<addresses> {

  const { account, chain, currency } = args

  return await prisma.addresses.findFirstOrThrow({
    where: {
      account_id: account.id,
      currency,
      chain
    }
  })

}
