const assert = require("assert");
const ExtendedPublicKeyService = require("../lib/dash/extended_public_key_service");
const XPubKeyUtil = require("../lib/dash/extended_public_key_util");

const xpubkey =
"xpub68BLHiFmvFCssfUNpq7rVhBbZyFb7i2B4C16vrJAiwrAvzvEyHxeCRKGNuHsmz1KfJJwaU2mdrdruTgmK71hyXju9urB3uTdxRdk4MXh3R1";

describe("Dash Extended Public Key", () => {

  describe("Util (Pure Functions)", () => {

    it("#generate address with xpubkey and nonce", () => {

      let nonce = 1;

      let pubkey1 = XPubKeyUtil.generate(xpubkey, nonce);
      console.log(pubkey1);

      nonce = nonce + 1;

      XPubKeyUtil.generate(xpubkey, nonce);

      let pubkey2 = XPubKeyUtil.generate(xpubkey, nonce);

      console.log(pubkey2);

      assert(pubkey1 !== pubkey2);
    });
  });

  describe("Service", () => {
    var service;

    before(() => {
      service = new ExtendedPublicKeyService(xpubkey);
    });


    it("DashExtendedPublicKey.nextAddress should generate a first address", done => {

      service.nextAddress().then(address => {
        console.log('address', address);
        assert(address);
        done();
      })
      .catch(error => {
        console.error(error);
        assert(!error);
      });
    });

    it("DashExtendedPublicKey.nextAddress should generate another address", done => {

      service.nextAddress().then(firstAddress => {
        console.log('firstAddress', firstAddress);
        done();

        service.nextAddress().then(secondAddress => {
        console.log('secondAddress', secondAddress);

          assert(firstAddress !== secondAddress);
        });
      });
    });
  });
});

