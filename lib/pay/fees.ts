
import { convert } from '../prices';

import { BigNumber } from 'bignumber.js';

import { toSatoshis } from './'

const fees = { }

const feesFiat = {
  'BCH': {
    currency: 'USD',
    value: 0.01
  },
  'DASH': {
    currency: 'USD',
    value: 0.01
  },
  'BSV': {
    currency: 'USD',
    value: 0.01
  },
  'LTC': {
    currency: 'USD',
    value: 0.01
  },
  'DOGE': {
    currency: 'USD',
    value: 0.01
  },
  'BTC': {
    currency: 'USD',
    value: 0.10
  },
  'XMR': {
    currency: 'USD',
    value: 0.01
  }
}

export interface Fee {
  address: string;
  amount: number;
}

export async function getFee(currency:string, amount?: number): Promise<Fee> {

  if (!fees[currency]) {
  
    await updateFees();

  } else {

    updateFees();

  }

  var fee = fees[currency];

  if (amount) {

    let feeAmount = new BigNumber(amount).times(0.001).toNumber()

    if (feeAmount > fee) {

      fee = feeAmount
    }

    if (currency === 'BTC' && fee < 546) { // 546 is the dust limit

      fee = 546

    }

  }

  switch(currency) {
  case 'BCH':
    return {
      address: 'qrggz7d0sgv4v3d0jl7lj4mv2vdnv0vqjsq48qtvt6',
      amount: fee
    }
  case 'DASH':
    return {
      address: 'Xwh247FF6SWymYLiJsMjM1BfrqVkzya6wh',
      amount: fee
    }
  case 'BTC':
    return {
      address: '17JiDrmEBftkPKtHojcJXAB8RSiv5nY6gc',
      amount: fee
    }
  case 'LTC':
    return {
      address: 'MLEV4eQfHvtkUGFXvQJE9gCtFwW7zNq1NJ',
      amount: fee
    }
  case 'DOGE':
    return {
      address: 'DRe5AjffdiLjtq9QSXW9RHGTMnm2hCQrRp',
      amount: fee
    }
  case 'BSV':
    return {
      address: '1Q9Z2y3Jhq6xbxD6AU34StgmUjfpbZgxqA',
      amount: fee
    }
  case 'XMR':
    return {
      address: '43iJfB8tYGFCBNEc8rjJnWHfrXzUapbeifsmS5S9wBEPEzGBCgogtCZSkHaU68UBMWG5pRXk56g7CekSZo7bYkyuNq52Dtn',
      amount: fee
    }
  }
}

async function updateFees() {
  
  for (let key of Object.keys(feesFiat)) {

    const fee = await convert(feesFiat[key], key);

    fees[key] = toSatoshis(fee.value)

  }

}

