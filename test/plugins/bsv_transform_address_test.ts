require('dotenv').config();

import { models } from '../lib';

import {addresses} from '../lib';
import {registerAccount} from '../lib/accounts';

import * as database from '../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('Addresses Library', () => {

  it("should set a valid bsv address with handcash handle", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'BSV'

   let changeset = {
      account_id: account.id,
      address: '$brandonbryant',
      currency: 'BSV'
    };

    await addresses.setAddress(changeset);

    let address = await models.Address.findOne({ where: { account_id: account.id , currency: 'BSV' }});

    assert(address);

  });

  it("should set a valid bsv address with paymail", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'BSV'

   let changeset = {
      account_id: account.id,
      address: 'brandonbryant@moneybutton.com',
      currency: 'BSV'
    };

    await addresses.setAddress(changeset);

    let address = await models.Address.findOne({ where: { account_id: account.id, currency: 'BSV' }});

    assert(address);

  });

});


