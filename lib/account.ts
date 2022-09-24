
import { models } from './models'

import { Orm, findAll, findOne } from './orm'

import { setAddress } from './core'

import { Address, findAddress } from './addresses'

import { Invoice } from './invoices'

interface SetAddress {
  currency: string;
  address: string;
}

export class Account extends Orm {

  static model = models.Account

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

    return findAll<Invoice>(Invoice, {
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
  }

}

export async function findAccount(id: number): Promise<Account> {

  return findOne<Account>(Account, {
    where: {
      id
    }
  })
}