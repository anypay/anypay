import * as dash from '@dashevo/dashcore-lib';

const bitcoincash = require('bitcore-lib-cash')

function getBitcore(currency: string) {

  var bitcore;

  switch(currency) {
  case 'BCH':
    bitcore = bitcoincash;
    break;
  case 'DASH':
    bitcore = dash;
    break;
  default:
    throw new Error(`xpubkeys for ${currency} not supported`);
  }

  return bitcore;

}

export function generateHDPrivateKey(currency: string) {

  let bitcore = getBitcore(currency);

  let hdPrivateKey = new bitcore.HDPrivateKey();
  let xPrivKey = hdPrivateKey.derive("m/0'");

  return xPrivKey;

}

export function generateAddress(currency: string, xpubkey: string, nonce: number) {

  let bitcore = getBitcore(currency);

  var NETWORK = bitcore.Networks.livenet;

  let pkey = new bitcore.HDPublicKey.fromBuffer(Buffer.from(xpubkey));

  let address = new bitcore.Address(pkey.derive(`m/0/${nonce}`).publicKey, NETWORK);

  return address.toString();

}

export function randomXpubKey(currency: string) {

  let hdPrivateKey = generateHDPrivateKey(currency);

  return hdPrivateKey.hdPublicKey.toString();

}
