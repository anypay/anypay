
import * as assert from 'assert';

import { models } from '../../lib';

import { registerAccount } from '../../lib/accounts';

import * as Chance from 'chance';

const chance = new Chance();

describe("Invoice Model", () => {

  it("should optionally allow cashback_amount", async () => {

    let account = await registerAccount(chance.email(), chance.word()); 

    let cashback_amount = 5;

    let invoice = await models.Invoice.create({

      cashback_amount,

      denomination_amount: 50,

      denomination_currency: 'USD',

      invoice_amount: 0.68,

      invoice_currency: 'DASH',

      address: '123213123123',

      amount: 0.68,

      currency: 'DASH',

      account_id: account.id

    });

    assert.strictEqual(invoice.cashback_amount, cashback_amount);

    assert(invoice.id > 0);

  });

});

