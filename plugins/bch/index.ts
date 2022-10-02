
require('dotenv').config();

import * as blockchair from '../../lib/blockchair'

import {log} from '../../lib';

const bch: any = require('bitcore-lib-cash');

export { bch as bitcore }

var bchaddr: any = require('bchaddrjs');

import { BroadcastTxResult } from '../../lib/plugins'

import { oneSuccess } from 'promise-one-success'

export async function broadcastTx(rawTx: string): Promise<BroadcastTxResult> {

  const broadcastProviders: Promise<BroadcastTxResult>[] = [

    blockchair.publish('bitcoin-cash', rawTx)

  ]

  return oneSuccess<BroadcastTxResult>(broadcastProviders)

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
