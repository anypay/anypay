import * as assert from 'assert';
import {models} from '../../lib';
import {accounts} from '../../lib';
import {setAddress} from '../../lib/core';
import {generateInvoice} from '../../lib/invoice';
import {handlePayment} from '../../lib/payment_processor';
import * as Chance from 'chance';
const chance = new Chance();

describe("Payment Handler", () => {

  describe("Correct Payment", () => {

    it("handlePayment should mark as paid", async () => {

      let account = await accounts.registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      let invoice = await generateInvoice(account.id, 10, 'DASH');

      console.log(invoice.toJSON());

      let payment = {
        currency: "DASH",
        amount: invoice.invoice_amount,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
      };

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      console.log(invoice.toJSON());

      assert.strictEqual(invoice.status, 'paid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
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
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
      };

      console.log(invoice.toJSON());

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      console.log(invoice.toJSON());

      assert.strictEqual(invoice.status, 'underpaid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
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

      console.log(invoice.toJSON());

      let payment = {
        currency: "DASH",
        amount: invoice.invoice_amount * 1.155,
        address: invoice.address,
        hash: 'f2fbd4fbb4bb84a22b9be5734473e90e7c8b7465ed8f49e983e73346681635a8'
      };

      await handlePayment(invoice, payment);

      invoice = await models.Invoice.findOne({ where: { id: invoice.id }});

      console.log(invoice.toJSON());

      assert.strictEqual(invoice.status, 'overpaid');
      assert.strictEqual(invoice.invoice_amount_paid, payment.amount);
      assert.strictEqual(invoice.denomination_amount_paid, invoice.denomination_amount * 1.155);

    });

  });

});

