
import { Orm, Record } from './orm'

import { Account } from './account'

import { models } from './models'

interface NewAccessTokenV1 {
  record: Record;
  account?: Account
}

export class AccessTokenV1 extends Orm {

  static model = models.AccessToken

  account: Account;

  constructor({ record, account }) {

    super(record)

    this.account = account
  }

}

export enum Versions {

  AccessTokenV1

}

export async function ensureAccessToken(account: Account, version: Versions = Versions.AccessTokenV1): Promise<AccessTokenV1> {

  let [record] = await models.AccessToken.findOrCreate({

    where: {
      account_id: account.id
    },

    defaults: {
      account_id: account.id
    }
  })

  return new AccessTokenV1({ record, account })

}

