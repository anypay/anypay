require('dotenv').config();

import * as assert from 'assert';

import { accounts, models } from '../../lib';

import * as Chance from 'chance';

const chance = Chance();

describe("Accounts library", () => {

  it("#setName should set the business name for an account", async () => {

    let email = chance.email();

    let account = await accounts.registerAccount(email, chance.word());

    var businessName = 'Some Nice Grocery';

    await accounts.setName(account.email, businessName);

    account = await models.Account.findOne({ where: { email }});

    assert.strictEqual(account.business_name, businessName);

  });

  it("#setPhysicalAddress should set the business address for an account", async () => {

    let email = chance.email();

    let account = await accounts.registerAccount(email, chance.word());

    let physicalAddress = chance.address();

    await accounts.setPhysicalAddress(account.email, physicalAddress);

    account = await models.Account.findOne({ where: { email }});

    assert.strictEqual(account.physical_address, physicalAddress);

  });

});
