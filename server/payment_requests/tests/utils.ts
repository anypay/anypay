
import { Server } from '../server'

var server

export { server }

import * as Chance from 'chance'

const chance = new Chance();

import { registerAccount } from '../../../lib/accounts';
import { setAddress } from '../../../lib/addresses';

export async function generateAccount() {
  let account = await registerAccount(chance.email(), chance.word());

  await setAddress(account, {
    currency: 'BSV',
    value: '167zSzMfqpg7HnR3XyWMPGwXHy4Mphvnwz'
  })

  await setAddress(account, {
    currency: 'BTC',
    value: '1Bd3pNdnjCSUWXQkncQCp1TkYuPdDL649S'
  })

  await setAddress(account, {
    currency: 'BCH',
    value: 'bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g'
  })

  await setAddress(account, {
    currency: 'DASH',
    value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
  })

  await setAddress(account, {
    currency: 'LTC',
    value: 'MJH9DxwdDpYMwdaqdXD3ypUYFcbvYybawW'
  })

  return account
}

import { generateInvoice } from '../../../lib/invoice';

export { generateInvoice }

export async function initServer() {

  server = await Server()

}

