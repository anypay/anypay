
import { models } from '../models'

import { Invoices } from './invoices'
import { Addresses } from './addresses'

interface FindOrCreate {
  where: any;
  defaults: any;
}

export async function findOrCreate(_findOrCreate: FindOrCreate): Promise<any> {

  let model = await models.Account.findOrCreate(_findOrCreate)

  return new Account(model[0])

}

export function build(model) {
  return new Account(model)
}

class Account {
  model: any; // sequelize model
  invoices: Invoices;
  addresses: Addresses;

  constructor(model) {
    this.model = model
    this.invoices = new Invoices({ account_id: model.id })
    this.addresses = new Addresses(this)
  }

  get id() {
    return this.model.id
  }

  get currency() {
    return this.model.denomination
  }
}

