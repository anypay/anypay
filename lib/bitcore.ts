
import { BigNumber } from 'bignumber.js';

import { plugins } from './plugins'

export function getBitcore(currency) {

  let plugin = plugins.findForChain(currency)

  if (!plugin.bitcore) {

    throw new Error('bitcore not found for currency')

  }

  return plugin.bitcore

}

export function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 

  return amt.times(amount).toNumber();
}

