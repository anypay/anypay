
import { models } from './models'

import { Orm } from './orm'

import { setAddress } from './core'

import { Address, findAddress } from './addresses'

import { Invoice } from './invoices'

interface SetAddress {
  currency: string;
  address: string;
}

export class Account extends Orm {

  static model = models.Account;

  static async fromAccessToken({ token }: { token: string }): Promise<Account> {

    let accessToken = await models.AccessToken.findOne({ where: { uid: token }})

    if (!accessToken) { return null }

    return this.findOne({ id: accessToken.account_id })

  }

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

    await setAddress({
      account_id: this.id,
      currency: params.currency,
      address: params.address
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

