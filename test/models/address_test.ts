require('dotenv').config();

import { models, accounts } from '../../lib';

import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Address Model', () => {

  it("should have an account, currency, value", async () => {

    let account = await accounts.registerAccount(chance.email(), chance.word());

    let address = await models.Address.create({
      account_id: account.id,
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
      currency: 'DASH',
      chain: 'DASH',
      locked: true
    });

    assert(address.id > 0);
    assert(address.locked);

  });

});


