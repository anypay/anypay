import * as assert from 'assert';

import { models, accounts, bankAccounts, addresses, ach } from '../../lib';

import { generateInvoice } from '../../lib/invoice';

import * as Chance from 'chance';

const chance = new Chance();

describe("ACH Batch Library", () => {

  var bankAccount1, account1, invoice1, bankAccount, account, invoice;

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

    invoice = await generateInvoice(account.id, 100, 'BSV');

    invoice = await models.Invoice.findOne({where:{uid:invoice.uid}});

    invoice.status = "paid";

    invoice.denomination_amount_paid = invoice.denomination_amount;

    invoice.amount_paid = invoice.amount;

    await invoice.save();

    account1 = await accounts.registerAccount(chance.email(), chance.word());

    bankAccount1 = await bankAccounts.create({
      beneficiary_name: "Steven",
      beneficiary_address: "110 State Street",
      city: "Porstmouth",
      state: "NH",
      zip: "03801",
      routing_number: "211489494",
      beneficiary_account_number: "123456789",
      account_id: account1.id
    })

    await accounts.enableACH(account1.id)

    invoice1 = await generateInvoice(account1.id, 100, 'DASH');

    invoice1 = await models.Invoice.findOne({where:{uid:invoice1.uid}});

    invoice1.status = "underpaid";

    invoice1.denomination_amount_paid = invoice1.denomination_amount-1;

    invoice1.amount_paid = invoice1.amount-1;

    await invoice1.save();


  });

  describe("Generating ACH batches", () => {

    it("should create a ach batch record and update all invoices not included in a batch", async () => {

      let achBatch = await ach.generateBatch();

            //assert(achBatch.id)

            //assery(achBatch

      let batchPayments = await ach.getBatchOutputs(achBatch.id);
      console.log("BATCH PAYMENTS", batchPayments)
            /* 
      let invoices = await ach.batchSent({
        batch_id : "12324",
        type: "test",
        effective_date: Date.now(),
        batch_description: "anypay test",
        amount: invoice.denomination_amount + invoice1.denomination_amount,
        currency: "USD"
      })*/


    });


  });

});

