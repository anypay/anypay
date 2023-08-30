require('dotenv').config();

import { models, initialize } from '../../lib';

import {addresses} from '../../lib';
import {registerAccount} from '../../lib/accounts';

import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Addresses Library', () => {
  
  before(async () => {

    await initialize()

  })

  it("should lock and unlock an address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'DASH'

    let chain = 'DASH'

    let address = await models.Address.create({
      account_id: account.id,
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
      currency,
      chain
    });

    assert(address.id > 0);
    assert(!address.locked);

    await addresses.lockAddress({
      account_id:  account.id,
      currency,
      chain
    });

    address = await models.Address.findOne({ where: { id: address.id }});

    assert(address.locked);

    await addresses.unlockAddress({
      account_id: account.id,
      currency,
      chain
    });

    address = await models.Address.findOne({ where: { id: address.id }});

    assert(!address.locked);

  });

});


