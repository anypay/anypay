require('dotenv').config();

import * as assert from 'assert';
import * as Chance from 'chance';
import { registerAccount } from '../../lib/accounts';
const chance = new Chance();

import { getROI } from '../../lib/roi';

describe("Calculating accounts return on investment", () => {

  it("should return the roi for account_id 11", async () => {

    let account = await registerAccount(chance.email(), chance.word());

    let roi = await getROI(account.id)

    assert(roi);

  });

})
