
import { models } from './models'

import { Orm, Record } from './orm'

import { setAddress } from './core'

import { Address, findAddress } from './addresses'

interface SetAddress {
  currency: string;
  address: string;
}

export class Account extends Orm {

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

