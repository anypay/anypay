import { models, accounts } from '../../lib';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('CashbackMerchants Model', () => {

  it('should require an account_id, and specify whether enabled, percentage', async () => {

    let account = await accounts.registerAccount(chance.email(), chance.word());

    let cashBackMerchant = await models.CashbackMerchant.create({
      account_id: account.id
    });

    assert.strictEqual(cashBackMerchant.account_id, account.id);
    assert.strictEqual(cashBackMerchant.enabled, true);
    assert.strictEqual(cashBackMerchant.percent, 20);

  });

  it("should reject with an invalid account_id foreign key reference", async () => {

    try {

      let cashBackMerchant = await models.CashbackMerchant.create({
        account_id: 99999
      });
      
      console.log(cashBackMerchant.toJSON());

    } catch(error) {

      console.log(error.message);
      assert(error);    

    }
  });

});

