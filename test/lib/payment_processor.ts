require('dotenv').config();

import * as assert from 'assert';
import {models, prices} from '../../lib';
import {accounts} from '../../lib';
import {setAddress} from '../../lib/core';
import {generateInvoice} from '../../lib/invoice';
import {handlePayment} from '../../lib/payment_processor';
import {updateOutput} from '../../lib/payment_processor';
import * as Chance from 'chance';
const chance = new Chance();

describe("Payment Handler", () => {

  before(async () => {

    await prices.setPrice('DASH', 100, 'testsource', 'USD');

  });

  describe("Correct Payment", () => {

    it("handlePayment should mark as paid", async () => {

      let account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      let payment = {
        currency: "DASH",
        amount: invoice.invoice_amount,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8',
        output_hash: 'd3e2c274300a3a67dfdf3c264e4ceed624174fbf00fc8740157ccbc3d18fac7c'
      };

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      assert.strictEqual(invoice.status, 'paid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
      assert.strictEqual(invoice.output_hash, payment.output_hash);
      assert.strictEqual(invoice.denomination_amount_paid, invoice.denomination_amount);

    });

  });

  describe("Under Payment", () => {

    it("handlePayment should mark as underpaid", async () => {
      
      let account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      let payment = {
        currency: "DASH",
        amount: invoice.invoice_amount * 0.9,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8',
        output_hash: 'd3e2c274300a3a67dfdf3c264e4ceed624174fbf00fc8740157ccbc3d18fac7c'
      };

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      assert.strictEqual(invoice.status, 'underpaid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
      assert.strictEqual(invoice.output_hash, payment.output_hash);
      assert.strictEqual(invoice.denomination_amount_paid, invoice.denomination_amount * 0.9);

    });

  });

  describe("Over Payment", () => {

    it("handlePayment should mark as overpaid", async () => {
      
      let account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      let payment = {
        currency: "DASH",
        amount: invoice.invoice_amount * 1.155,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8',
        output_hash: 'd3e2c274300a3a67dfdf3c264e4ceed624174fbf00fc8740157ccbc3d18fac7c'
      };

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      assert.strictEqual(invoice.status, 'overpaid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
      assert.strictEqual(invoice.output_hash, payment.output_hash);
      assert.strictEqual(invoice.denomination_amount_paid, invoice.denomination_amount * 1.155);

    });

  });

});

describe("Update Output", ()=>{

  it("It should update output when invoice is unpaid", async ()=>{

    let account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      let payment_1 = {
        currency: "DASH",
        amount: invoice.invoice_amount * 1.155,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
      };

      await handlePayment(invoice, payment_1);

      let payment_2 = {
        currency: "DASH",
        amount: invoice.invoice_amount * 1.155,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8',
        output_hash: 'd3e2c274300a3a67dfdf3c264e4ceed624174fbf00fc8740157ccbc3d18fac7c'
      };

      await updateOutput(payment_2)

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      assert.strictEqual(invoice.status, 'overpaid');
      assert.strictEqual(invoice.invoice_amount_paid, payment_1.amount);
      assert.strictEqual(invoice.output_hash, payment_2.output_hash);
      assert.strictEqual(invoice.denomination_amount_paid, invoice.denomination_amount * 1.155);
  })

})
