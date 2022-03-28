
import { BigNumber } from 'bignumber.js';

import { plugins } from './plugins'

export function getBitcore(currency) {

  let plugin = plugins.findForCurrency(currency)

  if (!plugin.bitcore) {

    throw new Error('bitcore not found for currency')

  }

  return plugin.bitcore

}

export function toSatoshis(amount): number{
  let amt = new BigNumber(amount); 
  let scalar = new BigNumber(100000000);

  return amt.times(amount).toNumber();
}

