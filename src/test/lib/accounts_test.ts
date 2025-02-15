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

require('dotenv').config();

import * as assert from 'assert';

import { accounts } from '@/lib';

import prisma from '@/lib/prisma';

import { chance } from '@/test/utils'

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
