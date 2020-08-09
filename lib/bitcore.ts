const btc = require('bitcore-lib');
const bch = require('bitcore-lib-cash');
const dash = require('@dashevo/dashcore-lib');
const bsv = require('bsv');

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
