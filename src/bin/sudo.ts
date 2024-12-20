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

import { v4 } from 'uuid';

import { hash } from '@/lib/password';

import { log } from '@/lib';

program

  .command('generatepassword')

  .action(async () => {

    let password = v4();


    let password_hash = await hash(password);

    log.info('generatepassword', {

      password,

      password_hash

    })

    process.exit(0);

  })

program

  .command('hashpassword <password>')

  .action(async (password) => {

    let password_hash = await hash(password);

    log.info('hashpassword', {

      password,

      password_hash

    })

    process.exit(0);

  })

program.parse(process.argv);

