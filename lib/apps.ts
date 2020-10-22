
import { models } from './models'

import * as bsv from 'bsv'

interface NewApp {
  name: string;
  account_id: number;
}

export async function createApp(params: NewApp) {

  let privkey = new bsv.PrivateKey()

  let app = await models.App.findOrCreate({

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
