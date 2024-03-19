
import { log } from './log'

import { models } from './models'

import { setAddress as _setAddress } from './core'

import {
  addresses as Address,
  accounts as Account
} from '@prisma/client'

import prisma from './prisma'

export async function listAddresses(account: Account): Promise<Address[]> {

  let records: Address[] = await prisma.addresses.findMany({ where: { account_id: account.id }})

  return records

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
