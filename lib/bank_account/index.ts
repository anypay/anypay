import { models, accounts } from '../../lib';

interface BankAccount{

  beneficiary_name:string,
  beneficiary_address:string,
  city: string,
  state:string,
  zip: string,
  routing_number: string,
  beneficiary_account_number: string,
  account_id: number

}

export async function create( account: BankAccount ){

  let bankAccount = await models.BankAccount.create({

    beneficiary_name: account.beneficiary_name,
    beneficiary_address: account.beneficiary_address,
    city: account.city,
    state: account.state,
    zip: account.zip,
    routing_number: account.routing_number,
    beneficiary_account_number: account.beneficiary_account_number,
    account_id: account.account_id
  })

  await accounts.setBankAccount( bankAccount.account_id, bankAccount.id)

  return bankAccount

}
