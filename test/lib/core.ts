import { logger, events, setAddress, unsetAddress } from '../../lib/core';
import { AddressChangeSet } from '../../lib/core/types/address_change_set';

import * as models from '../../lib/models';
import * as Account from '../../lib/models/account';
import * as Address from '../../lib/models/address';
import * as Chance from 'chance';
import * as assert from 'assert';

var chance = new Chance();

describe("Anypay Core", () => {

  var account, address;

  before(async function() {
    let email = chance.email().toUpperCase();

    account = await Account.create({
      email: email
    });

  });

  describe("Updating Account Address", () => {

    it("#setAddress should emit an event", (done) => {

      events.once('address:set', changeset => {

        logger.info('address:set', changeset);
        done();

      });

      setAddress({
        account_id: account.id,
        currency: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      }); 

    });

    it("setAddress should set a DASH address", async () => {

      let addressChangeset = {
        account_id: account.id,
        currency: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      await setAddress(addressChangeset); 
      
      address = await Address.findOne({ where: {
        account_id: account.id,
        currency:"DASH"
      }});

      assert.strictEqual(address.value, addressChangeset.address);

    });

    it("setAddress should set a BTC address", async () => {

      let addressChangeset = {
        account_id: account.id,
        currency: 'BTC',
        address: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K'
      };

      await setAddress(addressChangeset); 

      address = await Address.findOne({ where: {
        account_id: account.id,
	currency: "BTC"
      }});

      assert.strictEqual(address.value, addressChangeset.address);

    });

    it("#unsetAddress should emit an event", (done) => {

      events.once('address:unset', changeset => {

        logger.info('address:unset', changeset);
        done();

      });

      let addressChangeset = {
        account_id: account.id,
        currency: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      unsetAddress(addressChangeset);

    });

    it("unsetAddress should remove a DASH address", async () => {

      let addressChangeset = {
        account_id: account.id,
        currency: 'DASH',
        address: 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      await setAddress(addressChangeset);

      await unsetAddress(addressChangeset); 

      address = await Address.findOne({ where: {
        account_id: account.id,
	currency: "DASH"
      }});

      assert(!address);

    });

  });

  describe("Setting A Dynamic Address Not In Hardcoded List", () => {

    it("#setAddress should set a ZEN ZenCash address", async () => {

      let addressChangeset = {
        account_id: account.id,
        currency: 'ZEN',
        address: 'ZojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      await setAddress(addressChangeset); 

      var address = await models.Address.findOne({ where: {
        account_id: account.id,
        currency: 'ZEN'
      }});

      assert.strictEqual(address.value, addressChangeset.address);

    });

    it("#unsetAddress should set a ZEN ZenCash address", async () => {

      let addressChangeset = {
        account_id: account.id,
        currency: 'ZEN',
        address: 'ZojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      };

      await unsetAddress(addressChangeset); 

      var address = await models.Address.findOne({ where: {
        account_id: account.id,
        currency: 'ZEN'
      }});

      assert(!address);

    });

  });

});

