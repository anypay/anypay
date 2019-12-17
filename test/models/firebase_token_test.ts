
import { chance, generateAccount } from '../utils';
import { log, models, accounts } from '../../lib';
import * as assert from 'assert';

describe("Firebase Token Model", () => {

  it("should persisnt a token associated with an account", async () => {

    let account = await generateAccount();

    let record = await models.FirebaseToken.create({
      token: chance.word(),
      account_id: account.id
    });

    assert.strictEqual(record.account_id, account.id)
    assert(record.id > 0);

  });

});
