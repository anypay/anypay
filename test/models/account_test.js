require("dotenv").config();

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

  it('should reject an invalid bitcoin cash address', async () => {

    try {
      let account = await Account.create({
        email: chance.email(),
        bitcoin_cash_address: 'invalidaddress'
      })

      assert(!account.id);
      if (account.id) { throw new Error('should not be valid') }

    } catch(error) {
      console.error(error.message);
      assert(error);
    }

  });
  it('should accept a valid bitcoin cash address', async () => {
    var address = '13RS85NrE4TyHCVeuZu6d2N55nHGunNgCp';

    let account = await Account.create({
      email: chance.email(),
      bitcoin_cash_address: address
    })

    assert(account.id > 0);
    assert.strictEqual(account.bitcoin_cash_address, address);
  });

  it("should allow setting a lightning network account uri", async () => {
    var uri = '13RS85NrE4TyHCVeuZu6d2N55nHGunNgCp@10.0.0.1:54343';

    let account = await Account.create({
      email: chance.email(),
      lightning_uri: uri
    })

    assert(account.id > 0);
    assert.strictEqual(account.lightning_uri, uri);
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

