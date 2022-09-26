

import { log } from './log';

import { getAddress, getSupportedCoins } from './supported_coins';

import { Account } from './account';

import { AccessToken, ensureAccessToken } from './access_tokens'

import { create, findOne } from './orm'

import { hash } from './bcrypt'

export async function updateAccount(account: Account, payload): Promise<Account> {

  log.info('account.update', payload)

  await account.update(payload)

  log.info('account.updated', payload)

  return account

}

export async function registerAccount(email: string, password: string): Promise<Account>{

  let passwordHash = await hash(password);

  const account = await create<Account>(Account, {
    email: email,
    password_hash: passwordHash
  });

  await log.info('account.created', {
    account_id: account.get('id'),
    email: account.get('email')
  })

  return account;
}

export async function createAccessToken(id: number): Promise<AccessToken> {

  const account = await findOne<Account>(Account, { where: { id }})

  return ensureAccessToken(account)

}

export {
  getSupportedCoins,
  getAddress
}
