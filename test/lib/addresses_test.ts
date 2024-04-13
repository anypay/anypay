require('dotenv').config();

import { initialize } from '../../lib';

import {addresses} from '../../lib';
import {registerAccount} from '../../lib/accounts';

import prisma from '../../lib/prisma';

import { assert, chance } from '../utils'

describe('Addresses Library', () => {
  
  before(async () => {

    await initialize()

  })

  it("should lock and unlock an address", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let currency = 'DASH'

    let chain = 'DASH'

    let address = await prisma.addresses.create({
      data: {
        account_id: account.id,
        value: 'XoLSiyuXbqTQGUuEze7Z3BB6JkCsPMmVA9',
        currency,
        chain,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    assert(address.id > 0);
    assert(!address.locked);

    await addresses.lockAddress({
      account_id:  account.id,
      currency,
      chain
    });

    address = await prisma.addresses.findFirstOrThrow({
      where: {
        id: address.id
      }
    })

    assert(address.locked);

    await addresses.unlockAddress({
      account_id: account.id,
      currency,
      chain
    });

    address = await prisma.addresses.findFirstOrThrow({
      where: {
        id: address.id
      }
    })
    
    assert(!address.locked);

  });

});


