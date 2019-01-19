
import { blockcypher, log } from '../../lib';

import * as assert from 'assert';

describe("Blockcypher Address Forwards", () => {

  describe("Saving Blockcypher Address Forwards", () => {

    describe("blockcypher#recordAddressForward", () => {

      it("should save the forward record in the database", async () => {

        let addressForward = {
          "id": "1234lk2j342",
          "input_address": "16uKw7GsQSzfMaVTcT7tpFQkd7Rh9qcXWX",
          "destination": "15qx9ug952GWGTNn7Uiv6vode4RcGrRemh",
          "callback_url": "https://my.domain.com/callbacks/new-pay",
          "process_fees_address": "1LWw6FdzNUcX8bnekMMZ7eofcGF7SXmbrL",
          "process_fees_percent": 0.1,
          "token": "YOURTOKEN"
        };

        let record = await blockcypher.recordAddressForward(addressForward);

        assert.strictEqual(record.callback_url, addressForward.callback_url);
        assert(record.id > 0);

      });

    });
    
  });

  describe("Saving Blockcypher Address Forward Callbacks", () => {

    describe("lib.blockcypher", () => {

      describe("#recordAddressForwardCallback", () => {

        it("should save the forward callback in the database", async () => {

          let addressForwardCallback = {
            "value": 100000000,
            "input_address": "16uKw7GsQSzfMaVTcT7tpFQkd7Rh9qcXWX",
            "destination": "15qx9ug952GWGTNn7Uiv6vode4RcGrRemh",
            "input_transaction_hash": "39bed5d...",
            "transaction_hash": "1aa6103..."
          };

          let record = await blockcypher.recordAddressForwardCallback(
            addressForwardCallback
          );

          assert(record.id > 0);
          assert.strictEqual(
            record.transaction_hash,
            addressForwardCallback.transaction_hash
          );

        });

      });

    });

  });

});

