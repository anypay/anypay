require("dotenv").config();

import { models } from '../../lib';

const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

const Account = models.Account;

describe('Account Model', () => {

  it('should turn email to lower case when creating new account', async () => {

    let email = chance.email().toUpperCase();

    let downcasedEmail = email.toLowerCase();

    try {

      let account = await Account.create({ email });

      assert.strictEqual(account.email, downcasedEmail);

    } catch(error) {

      console.error("ERROR", error);

    }
  });

  it('should automatically generate a uid', done => {

    Account.create({
      email: chance.email()
    })
    .then(account => {
      assert(account.uid);
      done();
    });
  });


  it("should store the default denomination currency", async () => {

    let account = await Account.create({
      email: chance.email(),
      denomination: 'VEF'
    });

    assert(account.id > 0);
    assert.strictEqual(account.denomination, 'VEF');
  });

});

