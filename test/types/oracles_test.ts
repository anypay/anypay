import {Oracle} from '../../types/interfaces';
import "mocha";

describe("Interfaces", () => {

  function CheckValidOracle(oracle: Oracle): Oracle {
    return oracle;
  }

  describe("Oracle interface", () => {

    it("should be valid", () => {

      var oracle = CheckValidOracle({
        name: 'bitcoincash:forwarder',
        
        registerAddress: async (address) => {
          return address;

        },
        deregisterAddress: async (address) => {
          return address;

        }
      })
    });

    it("should require a #name")

    it("name should be unique")

    it("should require a #registerAddress function")

    it("should require a #deregisterAddress function")

  });

});

