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


