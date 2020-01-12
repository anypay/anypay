const assert = require("assert");
const SendDashBack = require('../lib/send_dash_back');

describe("SendDashBAck", () => {

  describe("sending dash back to a merchant", () => {

    it.skip('#sendToMerchant should send dash to merchant', async () => {

      let txid = await SendBackBack.sendToMerchant();

      assert(txid);
    });

  });

  describe("sending dash back to a customer", () => {

    it.skip('#sendToCustomer should send dash to customer', async () => {

      let txid = await SendBackBack.sendToCustomer();

      assert(txid);

    });

  });

});

