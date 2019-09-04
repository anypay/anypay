import * as bch from 'bitcore-lib-cash';

import { accounts, permanent } from '../../lib';
import { setAddress } from '../../lib/core';
import * as assert from 'assert';

import * as Chance from 'chance';

var chance = new Chance();

describe("Permanent Addresses", async () => {
  var account; 

  before(async () => {

    console.log("IN THE TEST");

    let email = chance.email();

    account = await accounts.registerAccount(email, chance.word());

  });


  it("should fail to create if the account does not have an address", async () => {

    let staticAddress = new bch.PrivateKey().toAddress().toString();

    console.log('STATIC', staticAddress);

    try {

      await permanent.setStaticAddress(account, 'BCH', staticAddress);

    } catch(error) {

      assert.strictEqual(
        error.message,
        `no BCH account address for account id ${account.id}`
      );

    }

  });

  it("should create an address route to the account's address", async () => {

    let accountAddress = new bch.PrivateKey().toAddress().toString()

    console.log('ACCOUNT ADDR', accountAddress);

    await setAddress({
      account_id: account.id,
      currency: 'BCH',
      address: accountAddress
    });

    let staticAddress = new bch.PrivateKey().toAddress().toString();

    permanent.setStaticAddress(account.id, 'BCH', staticAddress);

    let route = await permanent.getStaticAddressRoute(account.id, 'BCH');

    assert.strictEqual(route.input_address, staticAddress);

    assert.strictEqual(route.output_address, accountAddress);

  });

  describe("Updating an account's address", () => {

    it('should update the address route of the permanent address', async () => {

    });

  });

});

