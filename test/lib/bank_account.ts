require('dotenv').config();

import * as assert from 'assert';

import { accounts, models, bankAccounts } from '../../lib';

import * as Chance from 'chance';

const chance = Chance();

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

describe("Bank Accounts library", () => {

  it("it should create a bank account", async () => {

    let email = chance.email();

    let account = await accounts.registerAccount(email, chance.word());

    let bankAccount = await bankAccounts.create({
      beneficiary_name: "Brandon Bryant",
      beneficiary_address: "1 High Street",
      city: "Manchester",
      state: "NH",
      zip: "03103",
      routing_number: "211489494",
      beneficiary_account_number: "123456789",
      account_id: account.id
    })

    account = await models.Account.findOne({where:{id:account.id}});

    assert.strictEqual( account.bank_account_id, bankAccount.id)
    assert(bankAccount.id);
    assert.strictEqual(bankAccount.zip, "03103");
    assert.strictEqual(bankAccount.routing_number, "211489494");
    assert.strictEqual(bankAccount.beneficiary_account_number, "123456789");
    assert.strictEqual(bankAccount.beneficiary_name, "Brandon Bryant");

  });

});
