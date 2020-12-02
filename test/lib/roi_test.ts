require('dotenv').config();

import * as assert from 'assert';

import { getROI } from '../../lib/roi';

describe("Calculating accounts return on investment", () => {

  it.skip("should return the roi for account_id 11", async () => {

    let accountId = 11

    let roi = await getROI(accountId)

    assert(roi);

  });

})
