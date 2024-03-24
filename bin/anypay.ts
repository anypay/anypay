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

require('dotenv').config()

import { Command } from 'commander';
const program = new Command();

import { setAddress } from '../lib/addresses'

import { findByEmail } from '../lib/accounts'

program
  .option('-e, --email <string>')

program
  .command('set-address <currency> <address>')
  .action(async (currency, address, options) => {

    try {

      console.log({ currency, address, options })

      console.log(program.opts())

      const { email } = program.opts()

      const account = await findByEmail(email)

      let result = await setAddress(account, {
        currency,
        value: address
      })

      console.log(result)

    } catch(error) {

      console.error(error)

    }

    process.exit(0)

  })

program.parse(process.argv)
