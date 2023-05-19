
require('dotenv').config()

import log from './log'

import { load as loadWallet } from './wallet'

interface Unspent {

}

export interface Balance {
  asset: string;
  value: number;
  usd_value?: number;
  last_updated?: Date;
  address?: string;
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

