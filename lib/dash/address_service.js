const ExtendedPublicKey = require("../models/extended_public_key");
const ExtendedPublicKeyUtil = require("./extended_public_key_util");
const DashCore = require("../dashcore");

module.exports.getNewAddress = function(account_id) {

  return ExtendedPublicKey.findOne({ where: {
    account_id: account_id
  }})
  .then(extendedPublicKey => {

    if (!extendedPublicKey || !extendedPublicKey.xpubkey) {

      return DashCore.getNewAddress();
    } else {

      console.log("generate with extended public key", extendedPublicKey.xpubkey);

      try {
        let address = ExtendedPublicKeyUtil.random(extendedPublicKey.xpubkey);
        return Promise.resolve(address);
      } catch(error) {
        return Promise.reject(error);
      }
    }
  });
}
