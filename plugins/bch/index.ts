
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import {log} from '../../lib';

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

export async function broadcastTx(hex: string) {

  return blockchair.publish('bitcoin-cash', hex)

}

function validateAddress(address: string) {

  try {

    new bch.HDPublicKey(address);

    log.debug('plugins.bch.hdpublickey.valid', address)

    return true;

  } catch(error) {

    log.debug('plugins.bch.hdpublickey.invalid', error)

  }

  try {

    var isCashAddress = bchaddr.isCashAddress

    let valid = isCashAddress(address)

    return valid;

  } catch(error) {

    return false;

  }

}

export async function getNewAddress(record: any) {

  return record.value;

}

const currency = 'BCH';

export {

  currency,

  validateAddress

};
