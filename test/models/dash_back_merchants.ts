import { Account, DashBackMerchant } from '../../lib/models';
import * as database from '../../lib/database';
import * as assert from 'assert';
import * as Chance from 'chance';

const chance = new Chance();

describe('DashBackMerchants Model', () => {

  it('should require an account_id, and specify whether enabled, percentage', async () => {

    let email = chance.email();

    let account = await Account.create({
      email: email
    });

    let dashBackMerchant = await DashBackMerchant.create({
      account_id: account.id
    });

    assert.strictEqual(dashBackMerchant.account_id, account.id);
    assert.strictEqual(dashBackMerchant.enabled, true);
    assert.strictEqual(dashBackMerchant.percent, 20);

  });

  it("should reject with an invalid account_id foreign key reference", done => {

    let dashBackMerchant = DashBackMerchant.create({
      account_id: 99999
    })
    .catch(error => {
      console.log(error.message);
      assert(error);    
      done();
    });
  });

});

