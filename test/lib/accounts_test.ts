require('dotenv').config();

import * as assert from 'assert';

import { accounts } from '../../lib';

import prisma from '../../lib/prisma';

import { chance } from '../utils'

describe("Accounts library", () => {

  it("#setName should set the business name for an account", async () => {

    let email = chance.email();

    let account = await accounts.registerAccount(email, chance.word());

    var businessName = 'Some Nice Grocery';

    await accounts.setName(account, businessName);

    account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    })

    assert.strictEqual(account.business_name, businessName);

  });

  it("#setPhysicalAddress should set the business address for an account", async () => {

    let email = chance.email();

    let account = await accounts.registerAccount(email, chance.word());

    let physicalAddress = chance.address();

    await accounts.setPhysicalAddress(account, physicalAddress);

    account = await prisma.accounts.findFirstOrThrow({
      where: { email }
    })
    
    assert.strictEqual(account.physical_address, physicalAddress);

  });

});
