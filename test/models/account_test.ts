require("dotenv").config();

import { models } from '../../lib';

const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

const Account = models.Account;

describe('Account Model', () => {

  it('should turn email to lower case when creating new account', done => {

    let email = chance.email().toUpperCase();

    let downcasedEmail = email.toLowerCase();

    Account.create({
      email: email
    })
    .then(account => {
      console.log('original email', email);
      console.log('saved email', downcasedEmail);
      assert.strictEqual(account.email, downcasedEmail);
      done();
    });
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

