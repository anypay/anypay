const Account = require('../../lib/models/account');
const database = require('../../lib/database');
const assert = require('assert');
const Chance = require('chance');
const chance = new Chance();

describe('Account Model', () => {

  it('should turn email to lower case when creating new account', async () => {
    const email = chance.email();

    const account = await Account.create({
      email: email.toUpperCase()
    })
    assert.strictEqual(account.email, email.toLowerCase());
  });

  it('should automatically generate a uid', async () => {
    const account = await Account.create({
      email: chance.email()
    })
    assert(account.uid);
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

  after(() => {
    database.close();
  });
});
