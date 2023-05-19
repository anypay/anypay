
require('dotenv').config()

import log from './log'

import { load as loadWallet } from './wallet'

interface Unspent {

}

export interface Balance {
  chain: string;
  currency: string;
  value: number;
  decimals?: number; //TODO: Resolve why this is optional
  address?: string;
  last_updated?: Date;
  unspent?: Unspent[];
}

export async function listBalances(): Promise<Balance[]> {

  const wallet = await loadWallet()

  const balances = await wallet.balances()

  for (let balance of balances) {

    log.info('balance', balance)
  }

  return balances

}

