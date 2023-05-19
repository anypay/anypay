
import axios from 'axios'

import { Currency, Currencies } from './currency'

import config from './config'

import BigNumber from 'bignumber.js'

export interface Amount {

  currency: Currency;

  amount: number;

}

export async function convertBalance(balance: Balance, currency: Currency): Promise<Amount> {

  const api = config.get('api_base')

  if (balance.currency === Currencies.Satoshis) {

    balance.amount = new BigNumber(balance.amount).dividedBy(100000000).toNumber()

    balance.currency = Currencies.BSV

  }

  let { data } = await axios.get(`${api}/convert/${balance.amount}-${balance.currency}/to-${currency}`)

  let amount = data.conversion.output.value

  return {

    amount,

    currency

  }

}

