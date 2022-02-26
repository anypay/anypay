
import * as bsv from 'bsv'

let secret = process.env.GET402_APP_SECRET

import { App, Client } from 'get402'

import { Account } from './account'

import { models } from './models'

const app = App.load(secret)

export { app, Client }

export function createClient(identifier: string, privatekey?: bsv.PrivateKey) {
 
  return app.loadClient(identifier, privatekey)

}

export async function findClient(account: Account): Promise<Client> {

  let record = await models.Get402KeyPair.findOne({

    where: {

      account_id: account.id,

      active: true

    }

  })

  if (!record) { return }

  return createClient(record.identifier)

}

export async function loadClientForAccount(account: Account): Promise<Client> {

  let privateKey = new bsv.PrivateKey()

  let identifier = privateKey.toAddress().toString()

  let [record, isNew] = await models.Get402KeyPair.findOrCreate({

    where: {

      account_id: account.id,

      active: true

    },

    defaults: {

      identifier,
      
      account_id: account.id,

      active: true

    }

  })

  if (isNew) {

    return createClient(identifier, privateKey)

  } else {

    return createClient(record.identifier)

  }

}

