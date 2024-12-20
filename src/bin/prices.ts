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

import { Command } from 'commander';
const program = new Command();

import { log } from '@/lib/log';

import { createConversion, updateUSDPrices } from '@/lib/prices';

program
  .command('update_crypto_prices')
  .action(async () => {

    try {

      log.info('updating crypto prices');

      //await updateCryptoUSDPrices();
      throw new Error('not implemented')

      log.info('updated crypto prices');

    } catch(error) {

      console.error('update_crypto_prices.error', error);

    }

    process.exit(0);

  });

program
  .command('update_usd')
  .action(async () => {

    try {

      log.info('updating usd prices');

      await updateUSDPrices();

      log.info('updated usd prices');

    } catch(error) {

      console.error('update_usd.error', error);

    }

    process.exit(0);

  });

program
  .command('convert <baseamount> <basecurrency> <targetcurrency>')
  .action(async (value, currency, targetCurrency) => {

    try {

      let conversion = await createConversion({

        value, currency 

      }, targetCurrency);

      console.log(conversion);

    } catch(error) {

      console.error('prices.createConversion.error', error);

    }

  });

program
  .parse(process.argv);
