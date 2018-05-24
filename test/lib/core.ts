import { logger, events, setAddress, unsetAddress } from '../../lib/core';
import { AddressChangeSet } from '../../lib/core/types/address_change_set';

describe("Anypay Core", () => {

  describe("Updating Account Address", () => {

    it("#setAddress should emit an event", async (done) => {

      events.on('address:set', changeset => {

        logger.info('address:set', changeset);
        done();

      });

      let accountId = 1;

      let addressChangeset = new AddressChangeSet(
        accountId,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      await setAddress(addressChangeset); 

    });

    it("#unsetAddress should emit an event", async (done) => {

      events.on('address:unset', changeset => {

        logger.info('address:unset', changeset);
        done();

      });

      let accountId = 1;

      let addressChangeset = new AddressChangeSet(
        accountId,
        'DASH',
        'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5'
      );

      await unsetAddress(addressChangeset); 

    });

  });

});

