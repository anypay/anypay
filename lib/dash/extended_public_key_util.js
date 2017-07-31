const dash = require("bitcore-lib-dash");

const NETWORK = dash.Networks.livenet;

function Generate(xpubkey, nonce) {

  let pkey = new dash.HDPublicKey.fromBuffer(new Buffer(xpubkey));

  let address = new dash.Address(pkey.derive(nonce).publicKey, NETWORK);

  return address.toString();
}

module.exports.generate = Generate;

