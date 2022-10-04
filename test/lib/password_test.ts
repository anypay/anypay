import * as assert from 'assert';

import { password, login, accounts } from '../../lib';

import { chance } from '../utils';

describe("Passwords", () => {

  describe("Resetting Passwords", () => {

    it("should properly reset a password", async () => {

      let email = chance.email();

      let account = await accounts.registerAccount(email, chance.word());

      let newPassword = chance.word();

      await password.resetPasswordByEmail(email, newPassword);

      let token = await login.withEmailPassword(email, newPassword);

      assert.strictEqual(token.get('account_id'), account.id);

    });

  });

});
