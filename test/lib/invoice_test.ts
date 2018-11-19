require('dotenv').config();

import { generateInvoice } from '../../lib/invoice';
import { replaceInvoice } from '../../lib/invoice';
import { registerAccount } from '../../lib/accounts';
import { setAddress, setDenomination } from '../../lib/core';
import * as assert from 'assert';

import * as Chance from 'chance';

const chance = new Chance();

describe("Creating Invoices", () => {

  it("#generateInvoice should create a new DASH invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    var amount = {
      currency: 'VEF',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');
    
    console.log('invoice', invoice.toJSON());

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'DASH');

    assert(invoice.invoice_amount > 0);
    assert.strictEqual(invoice.invoice_currency, 'DASH');

  });

  it("#generateInvoice should create a new DASH invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    var amount = {
      currency: 'GBP',
      value: 15
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'DASH');
    
    console.log('invoice', invoice.toJSON());

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'DASH');

    assert(invoice.invoice_amount > 0);
    assert.strictEqual(invoice.invoice_currency, 'DASH');

  });

  describe("Replacing an Invoice", () => {

    it("#replaceInvoice should change the currency of an invoice", async () => {

      let account = await registerAccount(chance.email(), chance.word());

      await setAddress({
        account_id: account.id,
        currency: "DASH",
        address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
      });

      await setAddress({
        account_id: account.id,
        currency: "BTC",
        address: "1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C"
      });

      var amount = {
        currency: 'VEF',
        value: 15000000
      };

      await setDenomination({
        account_id: account.id,
        currency: amount.currency
      });

      let invoice = await generateInvoice(account.id, amount.value, 'DASH');

      invoice = await replaceInvoice(invoice.uid, 'BTC');

      assert.strictEqual(invoice.currency, 'BTC')

    });

  });

});

