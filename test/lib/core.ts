import { logger, events, setAddress, unsetAddress } from '../../lib/core';
import { AddressChangeSet } from '../../lib/core/types/address_change_set';
import * as Account from '../../lib/models/account';
import * as Chance from 'chance';
import * as assert from 'assert';

var chance = new Chance();

describe("Anypay Core", () => {

  describe("Updating Account Address", () => {
    var account;

    before(async function() {
      let email = chance.email().toUpperCase();

      account = await Account.create({
        email: email
      });

    });

    it("#setAddress should emit an event", (done) => {

      events.once('address:set', changeset => {

        logger.info('address:set', changeset);
        done();

      });

      let addressChangeset = new AddressChangeSet(
        account.id,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      setAddress(addressChangeset); 

    });

    it("setAddress should set a DASH address", async () => {

      let addressChangeset = new AddressChangeSet(
        account.id,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      await setAddress(addressChangeset); 

      account = await Account.findOne({ where: {
        id: account.id
      }});

      assert.strictEqual(account.dash_payout_address, addressChangeset.address);

    });

    it("setAddress should set a BTC address", async () => {

      let addressChangeset = new AddressChangeSet(
        account.id,
        'BTC',
        '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K'
      );

      await setAddress(addressChangeset); 

      account = await Account.findOne({ where: {
        id: account.id
      }});

      assert.strictEqual(account.bitcoin_payout_address, addressChangeset.address);

    });

    it("#unsetAddress should emit an event", (done) => {

      events.once('address:unset', changeset => {

        logger.info('address:unset', changeset);
        done();

      });

      let addressChangeset = new AddressChangeSet(
        account.id,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      unsetAddress(addressChangeset); 

    });

    it("unsetAddress should remove a DASH address", async () => {

      let addressChangeset = new AddressChangeSet(
        account.id,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      await unsetAddress(addressChangeset); 

      account = await Account.findOne({ where: {
        id: account.id
      }});

      assert(!account.dash_payout_address);

    });

  });

});

