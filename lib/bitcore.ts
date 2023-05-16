
import { BigNumber } from 'bignumber.js';

import { find } from './plugins'

export function getBitcore(currency) {

  let plugin = find({ currency, chain: currency })

  if (!plugin.bitcore) {

    return {} 

  }

  return plugin.bitcore

}

export function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 

  return amt.times(amount).toNumber();
}

