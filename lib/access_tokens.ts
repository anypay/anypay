
import { Orm, findOrCreate } from './orm'

import { Account } from './account'

import { models } from './models'

import { generateAccountToken } from './jwt'

export class AccessTokenV0 extends Orm {

  static model: any = models.AccessToken;

  static findOrCreate(params: any): Promise<[AccessTokenV0, boolean]> {

    return findOrCreate<AccessTokenV0>(AccessTokenV0, params)

  }

}

export class AccessTokenV1 extends Orm {

  static model = models.AccessToken

  account: Account;

  jwt: string;

  constructor({ record, account }) {

    super(record)

    this.jwt = generateAccountToken(account, record.uid)

    this.account = account
  }


  get accessToken() {

    if (this.jwt) { return this.jwt }

    return this.get('uid')
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


