
import * as utils from '../utils';

import { log, models } from '../../lib';


describe("Ambassador Reward Model", () => {

  var account, ambassador;

  before(async () => {

    account = await utils.generateAccount();

    ambassador = await models.Ambassador.create({
      account_id: account.id,
      name:  utils.chance.name()
    });

  });

  it("should create a reward when a qualifying invoice is paid", async () => {

    let invoice = { uid: utils.uuid.v4() }
    var rewardRecord

    try {

      rewardRecord = await models.AmbassadorReward.create({
        ambassador_id: ambassador.id,
        invoice_uid: invoice.uid
      });
    } catch(error) {

      console.log('ERROR', error.message);
      log.error(error.message);
      utils.assert(false);

    }

    utils.assert(rewardRecord.id > 0);
    utils.assert.strictEqual(rewardRecord.ambassador_id, ambassador.id);
    utils.assert(!rewardRecord.hash);
    utils.assert(!rewardRecord.error);
    utils.assert.strictEqual(rewardRecord.invoice_uid, invoice.uid);

  });

});

