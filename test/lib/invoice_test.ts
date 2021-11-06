require('dotenv').config();

import { generateInvoice } from '../../lib/invoice';
import { replaceInvoice } from '../../lib/invoice';
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

