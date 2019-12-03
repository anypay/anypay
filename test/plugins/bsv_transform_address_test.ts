require('dotenv').config();

import { models } from '../../lib';

import {addresses} from '../../lib';
import {registerAccount} from '../../lib/accounts';

import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

import {validateAddress} from  '../../plugins/bsv';

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

    assert(validateAddress(address.value));

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

    assert(validateAddress(address.value));

  });

  it("should set a valid bsv address with valid bsv address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'BSV'

   let changeset = {
      account_id: account.id,
      address: '1JUMBWB4Pan1CaoRM95UnkECYngmjHzeWS',
      currency: 'BSV'
    };

    await addresses.setAddress(changeset);

    let address = await models.Address.findOne({ where: { account_id: account.id, currency: 'BSV' }});

    assert(validateAddress(address.value));

  });

  it("should throw error when trying to set q style address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'BSV'

   let changeset = {
      account_id: account.id,
      address: 'qqrud420hk929l736tzzyhyc59yx79jfhy8sd99qy',
      currency: 'BSV'
    };
  
    let error = false

    try {

      await addresses.setAddress(changeset)

    }catch(err){
    
      error = true;

    }

    assert(error)

  });

  it("should set a valid bsv address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'BSV'

   let changeset = {
      account_id: account.id,
      address: '1JUMBWB4Pan1CaoRM95UnkECYngmjHzeWS',
      currency: 'BSV'
    };
  
    let error = false

    try {

      await addresses.setAddress(changeset)

    }catch(err){
    
      error = true;

    }

    assert(!error)

  });



});


