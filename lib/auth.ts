
import { Account } from './account'

import { findOne } from './orm'

import { verifyToken } from './jwt'

interface VerifiedAuthToken {
  account_id: number;
}

export async function authorizeAccount(token: string): Promise<Account> {

  let verified: VerifiedAuthToken = await verifyToken(token)

  if (!verified) {
    throw new Error('Not Authorized')
  }

  return findOne<Account>(Account, { where: {id: verified.account_id }})

}
