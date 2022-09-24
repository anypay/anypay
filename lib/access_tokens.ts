
import { Orm } from './orm'

import { Account } from './account'

import { generateAccountToken } from './jwt'

import { models } from './models'

import { App } from './apps'

export class AccessToken extends Orm {

  static model = models.AccessToken

  account: Account;

  jwt: string;

  constructor({ record, account }) {

    super(record)

    this.jwt = generateAccountToken({
      account_id: account.id, 
      uid: record.uid
    })

    this.account = account
  }

  get accessToken() {

    return this.jwt

  }

  get uid() {
    
    return this.get('uid')
  }

}

export async function ensureAccessToken(account: Account): Promise<AccessToken> {

  let [record] = await models.AccessToken.findOrCreate({

    where: {
      account_id: account.id
    },

    defaults: {
      account_id: account.id
    }
  })

  return new AccessToken({ account, record })

}

export async function ensureAppAccessToken(app: App, account: Account): Promise<AccessToken> {

  let [record] = await models.AccessToken.findOrCreate({

    where: {
      account_id: app.get('account_id'),
      app_id: app.id
    },

    defaults: {
      account_id: app.get('account_id'),
      app_id: app.id
    }
  })

  return new AccessToken({ account, record })

}
