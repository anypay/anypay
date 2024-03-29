require('dotenv').config();

import {
  settings,
} from '../../lib';

import * as assert from 'assert';

import * as Chance from 'chance';
import { generateAccount } from '../utils';

const chance = new Chance();

describe("Settings", () => {

  describe("account settings", () => {

    it("setDenomination should set the denomination", async () => {
      const account = await generateAccount()

      let denomination = await settings.setDenomination(account.id, "BTC");
      denomination = await settings.setDenomination(account.id, "VEF");

      assert.strictEqual(denomination, "VEF");
    });

    it("getDenomination should return the denomination", async () => {
      const account = await generateAccount()

      await settings.setDenomination(account.id, "GBP");
      let denomination = await settings.getDenomination(account.id);

      assert.strictEqual(denomination, "GBP");
    });

  });

});

