
import { models } from './models'

export class Account {

  record: any;

  constructor(record: any) {

    this.record = record;
  }

  get id () {

    return this.record.id
  }

  get email () {

    return this.record.email
  }

  get denomination () {

    return this.record.denomination

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

