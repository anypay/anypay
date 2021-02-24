require('dotenv').config();

import { generateInvoice } from '../../lib/invoice';
import { replaceInvoice } from '../../lib/invoice';
import { settleInvoice } from '../../lib/invoice';
import { registerAccount, setAddressScalar } from '../../lib/accounts';
import { setAddress, setDenomination } from '../../lib/core';

import { updateCryptoUSDPrices } from '../../lib/prices/crypto';

import * as assert from 'assert';

import * as Chance from 'chance';
import * as moment from 'moment';

const chance = new Chance();

describe("Creating Invoices", () => {

  before(async () => {
    
    await updateCryptoUSDPrices()

  })

  it("#generateInvoice should create a new DASH invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    var amount = {
      currency: 'USD',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'USD');

    assert(moment(invoice.expiry));

  });

  it("#generateInvoice should create a new DASH invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    var amount = {
      currency: 'USD',
      value: 15
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'USD')

  });

  describe("Replacing an Invoice", () => {

    it.skip("#replaceInvoice should change the currency of an invoice", async () => {

      let account = await registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      await setAddress({
        account_id: account.id,
        currency: "BCH",
        address: "bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g"
      });

      var amount = {
        currency: 'USD',
        value: 15000000
      };

      await setDenomination({
        account_id: account.id,
        currency: amount.currency
      });

      let invoice = await generateInvoice(account.id, amount.value, 'DASH');

      invoice = await replaceInvoice(invoice.uid, 'BCH');

      assert.strictEqual(invoice.currency, 'BCH')

    });

  });

  describe("Settling an Invoice", () => {

    it('#settleInvoice should update with output payment information', async () => {

      let account = await registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      var amount = {
        currency: 'USD',
        value: 100
      };

      let invoice = await generateInvoice(account.id, amount.value, 'DASH');

      let payment = {
        hash: '123412342342342',
        amount: amount.value * 0.999,
        currency: 'DASH',
        address: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'
      }

      invoice = await settleInvoice(invoice, payment);

      assert.strictEqual(invoice.output_hash, payment.hash);
      assert.strictEqual(invoice.output_amount, payment.amount);
      assert.strictEqual(invoice.output_currency, payment.currency);
      assert.strictEqual(invoice.output_address, payment.address);

    });

  });

  describe("Modifying Invoice Amont with Price Scalar", () => {

    it('#should multiply the amount by the price scalar', async () => {

      let account = await registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      var amount = {
        currency: 'USD',
        value: 100
      };

      let invoiceWithoutScalar = await generateInvoice(account.id, amount.value, 'DASH');

      await setAddressScalar(account.id, 'DASH', 1.02); // 2% increase in price

      let invoiceWithScalar = await generateInvoice(account.id, amount.value, 'DASH');

    });

  });

});

