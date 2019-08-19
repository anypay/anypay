require('dotenv').config();
  
import { generateInvoice } from '../../lib/invoice';
import { registerAccount } from '../../lib/accounts';
import { setAddress, setDenomination } from '../../lib/core';
import * as assert from 'assert';

import * as Chance from 'chance';

const chance = new Chance();

describe("Creating Invoices", () => {

  it("#generateInvoice should create a new XRP invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "XRP",
      address: "r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ"
    });

    var amount = {
      currency: 'VEF',
      value: 15000000
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'XRP');

    console.log('invoice', invoice.toJSON());

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'XRP');

    assert(invoice.invoice_amount > 0);
    assert.strictEqual(invoice.invoice_currency, 'XRP');

  });

  it("#generateInvoice should create a new XRP invoice", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "XRP",
      address: "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV"
    });

    var amount = {
      currency: 'GBP',
      value: 15
    };

    await setDenomination({
      account_id: account.id,
      currency: amount.currency
    });

    let invoice = await generateInvoice(account.id, amount.value, 'XRP');

    console.log('invoice', invoice.toJSON());

    assert.strictEqual(invoice.denomination_amount, amount.value);
    assert.strictEqual(invoice.denomination_currency, amount.currency);

    assert(invoice.amount > 0);
    assert.strictEqual(invoice.currency, 'XRP');

    assert(invoice.invoice_amount > 0);
    assert.strictEqual(invoice.invoice_currency, 'XRP');

  });

});
