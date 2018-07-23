import {BitcoinCashForwarder} from '../../lib/oracles/bitcoincash_forwarder';
import * as assert from 'assert';

describe("BitcoinCashForwarder Oracle", () => {

  it("should be named 'bitcoincash:forwarder'", () => {

    let oracle = new BitcoinCashForwarder();

    assert.strictEqual(oracle.name, 'bitcoincash:forwarder');

  });

  it.skip("#registerAddress should return a new address", async () => {

    let oracle = new BitcoinCashForwarder();

    let outputAddress = '13RS85NrE4TyHCVeuZu6d2N55nHGunNgCp';

    let inputAddress = await oracle.registerAddress(outputAddress); 

    assert(inputAddress != outputAddress);

  });

});

