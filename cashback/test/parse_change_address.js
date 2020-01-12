const assert = require("assert");
const TxParser = require("../lib/tx_parser");

describe("Parsing Change Address From Tx Hash", () => {

  if (process.env.RPC_HOST) {

    it("TxParser.getChangeAddressFromInvoice should get the change address", async () => {

      const invoice = {
        hash: '84ad9aa495f3bb15db1d78bf3a48225493a682b6a327beb21c7a24411eb74f24',
        address: 'XjPNBqyuw6SSpgssu4c9z2UE4XguQx9cFU',
        status: 'paid'
      };

      let changeAddress = await TxParser.getChangeAddressFromInvoice(invoice);

      assert.strictEqual(changeAddress, 'XnDt6K5Wtf1yrhsaqEPSv4Lt7mV7ENwnoA');

    });
  }

});

