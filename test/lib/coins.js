const Account = require('../../lib/models/account');
const assert = require('assert');
const Chance = require('chance');
const coins = require('../../lib/coins');
const bitcore = require('bitcore-lib');

const chance = new Chance();

describe("Coins Library", () => {

  describe("Account Support For Coins", () => {
    var account;

    before(async () => {
      
      account = await Account.create({
        email: chance.email()
      });
    });

    it("should list coins by account id", async () => {

      try {
        let accountCoins = await coins.listEnabledByAccountId(account.id);
        
        assert.strictEqual(accountCoins['BTC'].code, 'BTC');
        assert.strictEqual(accountCoins['BTC'].name, 'bitcoin');
        assert.strictEqual(accountCoins['BTC'].enabled, false);

      } catch(e) {
        console.log('error', e.message);
        throw e;
      }

    });

    it("should support a BTC after adding bitcoin address", async () => {

      var address = '18piUZfCTPLVzMHA3RrH7dg5WUZpEbFBED';

      try {

        coins.addAddressToAccount("BTC", address);

        let accountCoins = await coins.listEnabledByAccountId(account.id);

        assert.strictEqual(accountCoins[0], 'BTC');
      } catch(error) {
        console.log('error', error.message);
        throw error;
      }
    });

  });

  describe("globally disabling bitcoin", () => {

  });

  after(process.exit);
});


