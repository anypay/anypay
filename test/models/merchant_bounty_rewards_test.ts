require('dotenv').config();

import { models } from '../../lib';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('MerchantBountyRewards Model', () => {

  it('should require a merchant and ambassador id', async () => {

    let merchant = await models.Account.create({
      email: chance.email()
    });

    let ambassador = await models.Account.create({
      email: chance.email()
    });

    let merchantBountyReward = await models.MerchantBountyReward.create({
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

