require('dotenv').config();

import { models } from '../../lib';

import {addresses} from '../../lib';
import {registerAccount} from '../../lib/accounts';

import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Addresses Library', () => {

  it("should lock and unlock an address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'DASH'

    let address = await models.Address.create({
      account_id: account.id,
      value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
      currency
    });

    assert(address.id > 0);
    assert(!address.locked);

    await addresses.lockAddress(account.id, currency);

    address = await models.Address.findOne({ where: { id: address.id }});

    assert(address.locked);

    await addresses.unlockAddress(account.id, currency);

    address = await models.Address.findOne({ where: { id: address.id }});

    assert(!address.locked);

  });

  it("should set an address and unset an address", async ()=>{
   
    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'DASH'

    let address  = 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9'

    let changeSet = {
      account_id : account.id,
      currency: currency,
      address: address
    }

    await addresses.setAddress(changeSet)

    let setAddress  = await models.Address.findOne({ where: {

      account_id: changeSet.account_id,

      currency: changeSet.currency

    }});

    assert.strictEqual(address, setAddress.value)

    console.log('SET', setAddress)

    let unChangeSet = {
      account_id: account.id,
      currency: currency,
      address: address
    }
    await addresses.unsetAddress(changeSet);

    let unsetAddress  = await models.Address.findOne({ where: {

      account_id: changeSet.account_id,

      currency: changeSet.currency

    }});

    console.log('UNSET', unsetAddress)

    assert.strictEqual(unsetAddress, null)

  })

});


