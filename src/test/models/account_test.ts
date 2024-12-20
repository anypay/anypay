require("dotenv").config();

import prisma from '@/lib/prisma';

const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

describe('Account Model', () => {

  it("should store the default denomination currency", async () => {

    const account = await prisma.accounts.create({
      data: {
        email: chance.email(),
        denomination: 'VEF',
        updatedAt: new Date(),
        createdAt: new Date()
      }
    });

    assert(account.id > 0);
    assert.strictEqual(account.denomination, 'VEF');
  });

});

