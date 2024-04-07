#!/usr/bin/env ts-node
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

import {setAddress} from '../../lib/core';
import prisma from '../../lib/prisma';

const argv = require('yargs').argv;

(async function() {

  if (!argv.email) {

    console.log('--email must be provided');

    process.exit(0);

  }

  if (!argv.currency) {

    console.log('--currency must be provided');

    process.exit(0);

  }

  if (!argv.address) {

    console.log('--address must be provided');

    process.exit(0);

  }

  let account = await prisma.accounts.findFirstOrThrow({
    where: {
      email: argv.email
    }
  })

  console.log('account found', account);

  await setAddress({
    currency: argv.currency,
    address: argv.address,
    account_id: account.id,
    chain: argv.chain || argv.currency
  });

  account = await prisma.accounts.findFirstOrThrow({
    where: {
      email: argv.email
    }
  })
  console.log(JSON.parse(JSON.stringify(account)));

})();
