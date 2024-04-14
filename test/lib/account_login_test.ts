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

require("dotenv").config();

import {withEmailPassword} from '../../lib/account_login';
import {registerAccount} from '../../lib/accounts';

import { assert, chance } from '../utils';

describe('Account Login', () => {

  describe("registering an account", () => {
  
    it('#registerAccount should create a new account', async () => {

      let email = chance.email();
      let password = chance.word();

      let account = await registerAccount(email, password);

      assert(account.id > 0);
      assert.strictEqual(account.email, email);
    });
    
  });

  it("#withEmailPassword should automatically downcase an email", async () => {

    let email = chance.email();
    let password = chance.word();

    let account = await registerAccount(email, password);

    let token = await withEmailPassword(email.toUpperCase(), password);

    assert(token);
    assert.strictEqual(token.account_id, account.id);
    assert(token.id > 0);
  });


});


