require('dotenv').config();

import { Account, MerchantBountyReward } from '../../lib/models';
import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('MerchantBountyRewards Model', () => {

  it('should require a merchant and ambassador id', async () => {

    let merchant = await Account.create({
      email: chance.email()
    });

    let ambassador = await Account.create({
      email: chance.email()
    });

    let merchantBountyReward = await MerchantBountyReward.create({
      denomination_amount: 200,
      denomination_currency: "USD",
      payment_amount: 0.78,
      payment_currency: "DASH",
      merchant_id: merchant.id,
      ambassador_id: ambassador.id
    });

    assert.strictEqual(merchantBountyReward.merchant_id, merchant.id);
    assert.strictEqual(merchantBountyReward.ambassador_id, ambassador.id);

  });

});

