const dash = require("bitcore-lib-dash");

const NETWORK = dash.Networks.livenet;

const ONE_MILLION = 1000000;

function Generate(xpubkey, nonce) {

  let pkey = new dash.HDPublicKey.fromBuffer(new Buffer(xpubkey));

  let address = new dash.Address(pkey.derive(nonce).publicKey, NETWORK);

  return address.toString();
}

function Random(xpubkey) {

  let nonce = Math.floor(Math.random() * ONE_MILLION);

  return Generate(xpubkey, nonce);
}

module.exports.generate = Generate;
module.exports.random = Random;

