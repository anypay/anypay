import * as assert from 'assert';

import { models, accounts, bankAccounts, addresses } from '../../lib';

import { generateInvoice } from '../../lib/invoice';

import * as Chance from 'chance';

const chance = new Chance();


describe("Payment Option Library", () => {

  var bankAccount, account;

  before(async () => {

    account = await accounts.registerAccount(chance.email(), chance.word());

    bankAccount = await bankAccounts.create({
      beneficiary_name: "Brandon Bryant",
      beneficiary_address: "1 High Street",
      city: "Manchester",
      state: "NH",
      zip: "03103",
      routing_number: "211489494",
      beneficiary_account_number: "123456789",
      account_id: account.id
    })

    await accounts.enableACH(account.id)


  });

  describe("Generating an invoice with ACH enabled", () => {

    it("should generate invoice with bank_account_id", async () => {

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      assert.strictEqual(invoice.bank_account_id, bankAccount.id);

    });

    it("should generate invoice without bank_account_id when ach is disabled", async () =>{

      await accounts.disableACH(account.id);

      await addresses.setAddress({
        account_id: account.id,
        currency: "DASH",
        address :'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9' 
      })
      let invoice = await generateInvoice(account.id, 10, 'DASH');

      assert.strictEqual(invoice.bank_account_id, null);

    })

  });

});


function sleep(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });
}
