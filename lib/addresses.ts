/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { log } from './log'

import { setAddress as _setAddress } from './core'

import {
  addresses as Address,
  accounts as Account
} from '@prisma/client'

import prisma from './prisma'
import { getCoins } from './coins'
import { convert } from './prices'

interface AddressesMap {
  [key: string]: Address
}

interface AddressConfig {
  currency: string;
  chain: string;
  code: string;
  name: string;
  enabled: boolean;
  icon: string;
  supported: boolean;
  price?: number;
  wallet?: string;
  note?: string;
  address?: string;
  paymail?: string;
}

export async function listAddresses(account: Account): Promise<AddressConfig[]> {

  // should combine all available coins plus current addresses set 

  let records: Address[] = await prisma.addresses.findMany({ where: { account_id: account.id }})


  const recordsMap: AddressesMap = records.reduce((map: AddressesMap, record: Address) => {
    const code = `${record.currency}_${record.chain}`
    map[code] = record
    return map;
  }, {})

  let coins = await getCoins()

  return Promise.all(coins.map(async coin => {

    const code = `${coin.currency}_${coin.chain}`

    const addressConfig: AddressConfig = {
      currency: String(coin.currency),
      chain: String(coin.chain),
      code,
      name: coin.name,
      enabled: Boolean(coin.supported),
      icon: String(coin.logo_url),
      supported: Boolean(coin.supported),
    }

    let record = recordsMap[code]

    if (record) {
      if (record.value) {
        addressConfig.address = record.value
      }
      if (record.paymail) {
        addressConfig.paymail = record.paymail
      }

      if (record.note) {
        addressConfig.note = record.note
      }
    
    }

    try {

      const { value } = await convert ({ currency: String(coin.currency), value: 1 }, 'USD')

      addressConfig.price = value

    } catch(error) {

    }

    return addressConfig

  }))

}

export async function lockAddress(args: {account_id: number, currency: string, chain: string}): Promise<Address> {

  const { account_id, chain, currency } = args

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id,
      currency,
      chain
    }
  
  })

  return prisma.addresses.update({
    where: {
      id: address.id
    },
    data: {
      locked: true
    }
  })

}

export async function unlockAddress(args: {account_id: number, currency: string, chain: string}): Promise<Address> {

  const { chain, currency, account_id } = args

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id,
      currency,
      chain
    }
  
  })

  return prisma.addresses.update({
    where: {
      id: address.id
    },
    data: {
      locked: false
    }
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

export async function setAddress(account: Account, params: SetAddress): Promise<Address> {

  return _setAddress({
    address: params.value,
    currency: params.currency,
    chain: params.chain,
    view_key: params.view_key,
    account_id: account.id
  })

}

export async function removeAddress(args: {account: Account, currency: string, chain: string}): Promise<void> {

  const { account, chain, currency } = args

  const record = await prisma.addresses.findFirstOrThrow({
    where: {
      account_id: account.id,
      currency,
      chain
    }
  
  })

  await prisma.addresses.delete({
    where: {
      id: record.id
    }
  })

  log.info('address.removed', record)

}

export async function findAddress(args: {account: Account, currency: string, chain: string}): Promise<Address> {

  const address = await prisma.addresses.findFirst({
    where: {
      account_id: args.account.id,
      currency: args.currency,
      chain: args.chain
    }

  })

  if (!address) {
    throw new AddressNotFound(args.account, args.currency, args.chain)
  }

  return address

}
