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

import * as password from '@/lib/password';
import { Command } from 'commander';
const program = new Command();


program
  .version('0.1.0')
  .command('resetpassword <email> <password>')
  .action(async function(email, newPassword) {

    try {

      await password.resetPasswordByEmail(email, newPassword);

      console.log('password reset successfully!');

    } catch(error) {
      
      console.log("resetpassword.error", error);
    }

  });

program
  .command('send-email <email>')
  .action(async function(email) {

    try {

      await password.sendPasswordResetEmail(email);

      console.log('password reset successfully!');

    } catch(error) {
      console.log("send-email.error", error);
    }

  });



program.parse(process.argv);

