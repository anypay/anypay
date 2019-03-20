require('dotenv').config();

import {
  Account,
  Address
} from '../../lib/models';

import {registerAccount} from '../../lib/accounts';

import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Address Model', () => {

  it("should have an account, currency, value", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let address = await Address.create({
      account_id: account.id,
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
      currency: 'DASH',
      locked: true
    });

    assert(address.id > 0);
    assert(address.locked);

  });

});


