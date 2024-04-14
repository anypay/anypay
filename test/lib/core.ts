/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import { setAddress, unsetAddress } from '../../lib/core';

import { lockAddress, unlockAddress  } from '../../lib/addresses';

import * as Chance from 'chance';
import * as assert from 'assert';

import { generateAccount } from '../utils'

import { accounts as Account } from '@prisma/client'
import prisma from '../../lib/prisma';
import { prices } from '../../lib';

var chance = new Chance();

describe("Anypay Core", () => {

  describe("Updating Account Address", () => {

    it("#setAddress should fail if locked", async () => {

      const account = await generateAccount();

      await lockAddress({
        account_id: Number(account?.id),
        currency: 'DASH',
        chain: 'DASH'
      });
      
      try {

        await setAddress({
          account_id: Number(account?.id),
          chain: 'DASH',
          currency: 'DASH',
          address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
        }); 

        assert(false);

      } catch(error) {

        assert.strictEqual(error.message, `DASH address locked`); 

        await unlockAddress({
          account_id: Number(account?.id),
          currency: 'DASH',
          chain: 'DASH'
        });

      }

    });

    it("setAddress should set a DASH address", async () => {

      const account = await generateAccount();

      let addressChangeset = {
        account_id: account.id,
        currency: 'DASH',
        chain: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      await setAddress(addressChangeset); 

      const address = await prisma.addresses.findFirstOrThrow({
        where: {
          account_id: account.id,
          currency: 'DASH',
          chain: 'DASH'
        }
      
      })

      assert.strictEqual(address.value, addressChangeset.address);

    });

    it("setAddress should set a BTC address", async () => {

      const account = await generateAccount();

      let addressChangeset = {
        account_id: account.id,
        currency: 'BTC',
        chain: 'BTC',
        address: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K'
      };

      await setAddress(addressChangeset); 

      const address = await prisma.addresses.findFirstOrThrow({
        where: {
          account_id: account.id,
          currency: 'BTC',
          chain: 'BTC'
        }
      })

      assert.strictEqual(address.value, addressChangeset.address);

    });

    it("unsetAddress should remove a DASH address", async () => {

      const account = await generateAccount();

      await setAddress({
        account_id: account.id,
        currency: 'DASH',
        chain: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      });

      await unsetAddress({
        account_id: account.id,
        currency: 'DASH',
        chain: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      }); 

      const address = await prisma.addresses.findFirstOrThrow({
        where: {
          account_id: account.id,
          currency: 'DASH',
          chain: 'DASH'
        }
      })

      assert(!address);

    });

  });

  describe("Setting A Dynamic Address Not In Hardcoded List", () => {

    it("#setAddress should set a ZEN ZenCash address", async () => {

      const account = await generateAccount();

      await setAddress({
        account_id: account.id,
        currency: 'ZEN',
        address: 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk',
        chain: 'ZEN'
      }); 

      const address = await prisma.addresses.findFirstOrThrow({
        where: {
          account_id: account.id,
          currency: 'ZEN'
        }
      })

      assert.strictEqual(address.value, 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk');

    });

    it("#unsetAddress should set a ZEN ZenCash address", async () => {

      const account = await generateAccount();

      let addressChangeset = {
        account_id: account.id,
        currency: 'ZEN',
        address: 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk'
      };

      await unsetAddress({
        account_id: account.id,
        currency: 'ZEN',
        chain: 'ZEN',
        address: 'zszpcLB6C5B8QvfDbF2dYWXsrpac5DL9WRk'
      });

      const address = await prisma.addresses.findFirstOrThrow({
        where: {
          account_id: account.id,
          currency: 'ZEN'
        }    
      })

      assert(!address);

    });

  });

});

