
import { models } from './models'

import { Orm, Record } from './orm'

import { Address, findAddress, setAddress } from './addresses'

import { Invoice } from './invoices'

interface SetAddress {
  currency: string;
  address: string;
}

export class Account extends Orm {

  static async findOne(where: any): Promise<Account> {

    let record = await models.Account.findOne({ where })

    if (!record) {
    
      throw new Error('record not found');

    }

    return new Account(record)

  }

  get id () {

    return this.record.dataValues.id
  }

  get email () {

    return this.record.dataValues.email
  }

  get denomination () {

    return this.record.dataValues.denomination

  }

  async setAddress(params: SetAddress): Promise<Address> {

    await setAddress(this, {
      currency: params.currency,
      value: params.address
    })

    return findAddress(this, params.currency)

  }

  async listPaidInvoices(): Promise<Invoice[]> {

    let records = await models.Invoice.findAll({
      where: {
        status: 'paid',
        account_id: this.get('id'),
        app_id: null
      },

      include: [{
        model: models.Payment,
        as: 'payment'
      }, {
        model: models.Refund,
        as: 'refund'
      }],

      order: [['paidAt', 'desc']]
    })

    return records.map(record => {

      if (record.refund) {
        console.log(record.toJSON())
      }
      return new Invoice(record)
    })

  }

}

export class AccountNotFound implements Error {
  name = 'AccountNotFound'
  message = 'Account Not Found'
}


export async function findAccount(id: number): Promise<Account> {

  let record = await models.Account.findOne({ where: { id }})

  if (!record) {
  
    throw new AccountNotFound();

  }

  return new Account(record)

}

