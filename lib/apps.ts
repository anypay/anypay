
import { models } from './models'

import { Orm, create } from './orm'

import { AccessToken } from './access_tokens';

import * as bsv from 'bsv'

interface NewApp {
  name: string;
  account_id: number;
}

export class App extends Orm {

  static model = models.App

}

export async function findApp(id: number): Promise<App> {

  let record = await models.App.findOne({ where: { id }})

  return new App(record)
}

export async function findOne(where: any): Promise<App> {

  let record = await models.App.findOne({ where })

  return new App(record)
}

export async function createApp(params: NewApp): Promise<App> {

  let privkey = new bsv.PrivateKey()

  let [app] = await models.App.findOrCreate({

    where: {
      name: params.name,
      account_id: params.account_id
    },

    defaults: {
      name: params.name,
      account_id: params.account_id,
      public_key: privkey.toPublicKey().toString(),
      private_key: privkey.toString()
    }

  })

  return app

}

export async function createAppToken(app: App): Promise<AccessToken> {

  return create<AccessToken>(AccessToken, {
    account_id: app.get('account_id'),
    app_id: app.id
  })
}
