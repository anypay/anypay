const Util = require("./extended_public_key_util");

class XPubKeyService {

  constructor(xpubkey) {
    this._xpubkey = xpubkey;
    this._nonce = 0;
  }

  // override this with database in the future
  getNonce() {

    return new Promise((res, rej) => {

      this._nonce = this._nonce + 1;

      res(this._nonce);
    });
  }

  nextAddress() {
    return new Promise((res, rej) => {

      let address = this.getNonce().then(nonce => {

        res(Util.generate(this._xpubkey, nonce));
      });
    });
  }
}

module.exports = XPubKeyService;

