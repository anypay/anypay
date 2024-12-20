require('dotenv').config();

import {  accounts } from '@/lib';

import assert from 'assert';
import Chance from 'chance';
import prisma from '@/lib/prisma';

const chance = new Chance();

describe('Address Model', () => {

  it("should have an account, currency, value", async () => {

    let account = await accounts.registerAccount(chance.email(), chance.word());

    const address = await prisma.addresses.create({
      data: {
        account_id: account.id,
        value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
        currency: 'DASH',
        chain: 'DASH',
        locked: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    assert(address.id > 0);
    assert(address.locked);

  });

});


