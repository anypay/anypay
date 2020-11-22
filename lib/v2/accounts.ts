
import { models } from '../models'

interface FindOrCreate {
  where: any;
  defaults: any;
}

export async function findOrCreate(_findOrCreate: FindOrCreate): Promise<any> {

  let model = await models.Account.findOrCreate(_findOrCreate)

  return new Account({ model })

}

interface CreateInvoice {
  currency: string;
  amount: number;
}

class Invoices {
  account_id: number;
  constructor(options) {
    this.account_id = options.account_id
  }

  async create(opts: CreateInvoice) {


  }
}

class Account {
  model: any; // sequelize model
  invoices: Invoices;

  constructor(model) {
    this.model = model
    this.invoices = new Invoices({ account_id: model.id })
  }

}

