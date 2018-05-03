const assert = require("assert");
import {Oracles} from '../../lib/oracles';
import * as anypay from '../../lib/';

describe("Oracles", () => {

  it("#register should register an oracle", () => {

    const name = 'bitcoincash:forwarder';

    let oracles = new Oracles();

    oracles.registerOracle({

      name: name,

      registerAddress: async (address) => {
        return address;
      },

      deregisterAddress: async (address) => {
        return true;
      }
    });

    assert.strictEqual(oracles.getOracle('bitcoincash:forwarder').name, name);

  });

  it("anypay.oracles should have bitcoincash:forwarder registered", () => {

    var oracle = anypay.oracles.getOracle("bitcoincash:forwarder");

    assert(oracle);
  });

  it("anypay.oracles should have ripple:direct registered", () => {

    assert(anypay.oracles.getOracle("ripple:direct"));
  });

  it("anypay.oracles should have zcash:direct registered", () => {

    assert(anypay.oracles.getOracle("zcash:direct"));
  });

  it("anypay.oracles should have etherem:blockcypher:direct registered", () => {

    assert(anypay.oracles.getOracle("ethereum:blockcypher:direct"));
  });

  it("anypay.oracles should have dogecoin:blockcypher:forwarder registered", () => {

    assert(anypay.oracles.getOracle("dogecoin:blockcypher:forwarder"));
  });

  it("anypay.oracles should have bitcoin:blockcypher:forwarder registered", () => {

    assert(anypay.oracles.getOracle("bitcoin:blockcypher:forwarder"));
  });

  it("anypay.oracles should have litecoin:blockcypher:forwarder registered", () => {

    assert(anypay.oracles.getOracle("litecoin:blockcypher:forwarder"));
  });

  it("anypay.oracles should not have badoracle registered", () => {

    try {

      anypay.oracles.getOracle("badoracle");

    } catch(error) {

      assert(error);
    }
  });
});
