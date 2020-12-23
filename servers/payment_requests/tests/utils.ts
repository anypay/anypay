
import { Server } from '../server'

var server

export { server }

import * as Chance from 'chance'

const chance = new Chance();

import { registerAccount } from '../../../lib/accounts';
import { setAddress } from '../../../lib/core';

export async function generateAccount() {
  let account = await registerAccount(chance.email(), chance.word());

  await setAddress({
    account_id: account.id,
    currency: 'BSV',
    address: '167zSzMfqpg7HnR3XyWMPGwXHy4Mphvnwz'
  })

  await setAddress({
    account_id: account.id,
    currency: 'BTC',
    address: '1Bd3pNdnjCSUWXQkncQCp1TkYuPdDL649S'
  })

  await setAddress({
    account_id: account.id,
    currency: 'BCH',
    address: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
  })

  await setAddress({
    account_id: account.id,
    currency: 'DASH',
    address: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
  })

  await setAddress({
    account_id: account.id,
    currency: 'LTC',
    address: 'MJH9DxwdDpYMwdaqdXD3ypUYFcbvYybawW'
  })

  return account
}

import { generateInvoice } from '../../../lib/invoice';

export { generateInvoice }

export async function initServer() {

  server = await Server()

}

