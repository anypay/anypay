require("dotenv").config();

import * as assert from 'assert';

import * as Chance from 'chance';

import {withEmailPassword} from '../../lib/account_login';

import {registerAccount} from '../../lib/accounts';

const chance = new Chance();

describe('Account Login', () => {

  describe("registering an account", () => {
  
    it('#registerAccount should create a new account', async () => {

      let email = chance.email();
      let password = chance.word();

      let account = await registerAccount(email, password);

      assert(account.id > 0);
      assert.strictEqual(account.email, email);
      assert(account.password != password );
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


