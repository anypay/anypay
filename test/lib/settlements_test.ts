import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

import {generateInvoice} from '../../lib/invoice';
import {settlements, accounts} from '../../lib';
import { setAddress } from '../../lib/core';

describe("Adding an invoice to a settlement", () => {

  var account;

  before(async () => {

    account = await accounts.registerAccount(chance.email(), chance.word());

    await setAddress({
      account_id: account.id,
      currency: "DASH",
      address: "XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9"
    });

    account.should_settle = true;
    account.settlement_strategy = 'ach';

    await account.save();

  });

  it("#settlements.settleInvoice set the ach_batch_id", async () => {

    let invoice = await generateInvoice(account.id, 10, 'DASH');

    await settlements.settleInvoice(invoice);

    assert(invoice.ach_batch_id > 0);

  });

});

