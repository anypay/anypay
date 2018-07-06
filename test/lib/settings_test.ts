require('dotenv').config();

import {
  settings,
  models
} from '../../lib';

import * as assert from 'assert';

import * as Chance from 'chance';

const chance = new Chance();

describe("Settings", () => {

  describe("account settings", () => {
    var account: any;

    before(async () => {
      let email = chance.email();
      let password = chance.word();

      account = await models.Account.create({ email, password });
    });

    it("setDenomination should set the denomination", async () => {

      let denomination = await settings.setDenomination(account.id, "BTC");
      denomination = await settings.setDenomination(account.id, "VEF");

      assert.strictEqual(denomination, "VEF");
    });

    it("getDenomination should return the denomination", async () => {

      await settings.setDenomination(account.id, "GBP");
      let denomination = await settings.getDenomination(account.id);

      assert.strictEqual(denomination, "GBP");
    });

    it.skip("setDenomination should reject an unsupported denomination", async () => {

      try {

        await settings.setDenomination(account.id, "XXX");
        
        assert(false, 'invalid denomination should not be set');

      } catch(error) {
    
        assert.strictEqual(error.message, 'invalid denomination');
      }
    });

  });

});

