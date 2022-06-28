require('dotenv').config();

import * as http from 'superagent';

import * as blockchair from '../../lib/blockchair'

import {log, models} from '../../lib';

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

export async function submitTransaction(rawTx: string) {

  return broadcastTx(rawTx)

}

export async function broadcastTx(hex: string) {

  return blockchair.publish('bitcoin-cash', hex)

}

function validateAddress(address: string) {

  try {

    new bch.HDPublicKey(address);

    return true;

  } catch(error) {

    log.info('plugins.bch.address.invalid', error)

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

export const currency = 'BCH';

export {

  validateAddress

};
