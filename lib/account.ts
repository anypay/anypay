
import { models } from './models'

import { Orm, Record } from './orm'

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

