import * as assert from 'assert';

import { models, accounts, bankAccounts, addresses, ach } from '../../lib';

import { generateInvoice } from '../../lib/invoice';

import * as Chance from 'chance';

const chance = new Chance();

describe("ACH Batch Library", () => {

  var bankAccount1, account1, invoice1, bankAccount, account, invoice, invoice2, invoice3;

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

    invoice2 = await generateInvoice(account1.id, 100, 'BCH');

    invoice2 = await models.Invoice.findOne({where:{uid:invoice2.uid}});

    invoice2.status = "overpaid";

    invoice2.denomination_amount_paid = invoice2.denomination_amount+1;

    invoice2.amount_paid = invoice2.amount+1;

    await invoice2.save();


    invoice3 = await generateInvoice(account1.id, 100, 'BSV');

    invoice3 = await models.Invoice.findOne({where:{uid:invoice3.uid}});

    invoice3.status = "paid";

    invoice3.denomination_amount_paid = invoice3.denomination_amount;

    invoice3.amount_paid = invoice3.amount;

    await invoice3.save();




  });

  describe("Generating ACH batches", () => {

    it("should create a ach batch record and update all invoices not included in a batch", async () => {

      let inputs = await ach.generateBatchInputs();
   
      console.log(inputs)

      assert.strictEqual( inputs.length, 4 )

      let outputs = await ach.generateBatchOutputs(inputs[0].batch_id);
            
      assert.strictEqual( outputs.length, 2 )

      let batch = await models.AchBatch.findOne({where:{id: outputs[0].batch_id}})

      assert.strictEqual(batch.amount, 400 )

 
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

