const btc = require('bitcore-lib');
const bch = require('bitcore-lib-cash');
const dash = require('@dashevo/dashcore-lib');
const bsv = require('bsv');

import { BigNumber } from 'bignumber.js';

export function getBitcore(currency) {

  switch(currency) {
  case 'BTC':
    return btc;
  case 'BCH':
    return bch;
  case 'DASH':
    return dash;
  case 'BSV':
    return bsv;
  }

}

export function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 
  let scalar = new BigNumber(100000000);

  return amt.times(amount).toNumber();
}

