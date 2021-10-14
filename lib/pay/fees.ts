
import { convert } from '../prices';

import { BigNumber } from 'bignumber.js';

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
    value: 0.05
  },
  'DOGE': {
    currency: 'USD',
    value: 0.50
  },
  'BTC': {
    currency: 'USD',
    value: 1.00
  }
}

export interface Fee {
  address: string;
  amount: number;
}

export async function getFee(currency:string): Promise<Fee> {

  if (!fees[currency]) {
    await updateFees();
  }

  updateFees();

  switch(currency) {
  case 'BCH':
    return {
      address: 'qrggz7d0sgv4v3d0jl7lj4mv2vdnv0vqjsq48qtvt6',
      amount: fees[currency]
    }
  case 'DASH':
    return {
      address: 'Xwh247FF6SWymYLiJsMjM1BfrqVkzya6wh',
      amount: fees[currency]
    }
  case 'BTC':
    return {
      address: '17JiDrmEBftkPKtHojcJXAB8RSiv5nY6gc',
      amount: fees[currency]
    }
  case 'LTC':
    return {
      address: 'MLEV4eQfHvtkUGFXvQJE9gCtFwW7zNq1NJ',
      amount: fees[currency]
    }
  case 'DOGE':
    return {
      address: 'DRe5AjffdiLjtq9QSXW9RHGTMnm2hCQrRp',
      amount: fees[currency]
    }
  case 'BSV':
    return {
      address: '1Q9Z2y3Jhq6xbxD6AU34StgmUjfpbZgxqA',
      amount: fees[currency]
    }
  }

}

async function updateFees() {
  
  for (let key of Object.keys(feesFiat)) {

    let fee = await convert(feesFiat[key], key);

    fees[key] = new BigNumber(fee.value).times(100000000).toNumber();

  }

}

