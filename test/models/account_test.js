const Account = require('../../lib/models/account');
const database = require('../../lib/database');
const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

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

  after(() => {
    database.close();
  });
});

