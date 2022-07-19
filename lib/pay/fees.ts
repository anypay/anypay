
import { convert } from '../prices';

import { BigNumber } from 'bignumber.js';

import { toSatoshis } from './'

import { config } from '../config'

const fees = { }

/*
 * Fees paid to the platform operator should be equal to the greater of x% or y minimum
 *
 * For example an XMR fee of 0.1% or $0.02
 *
 */

const feeAddresses = {

}

const feesFiat = {
  'BCH': {
    address: 'qrggz7d0sgv4v3d0jl7lj4mv2vdnv0vqjsq48qtvt6',
    currency: 'USD',
    value: 0.01
  },
  'DASH': {
    address: 'Xwh247FF6SWymYLiJsMjM1BfrqVkzya6wh',
    currency: 'USD',
    value: 0.01
  },
  'BSV': {
    address: '1Q9Z2y3Jhq6xbxD6AU34StgmUjfpbZgxqA',
    currency: 'USD',
    value: 0.01
  },
  'LTC': {
    address: 'MLEV4eQfHvtkUGFXvQJE9gCtFwW7zNq1NJ',
    currency: 'USD',
    value: 0.01
  },
  'DOGE': {
    address: 'DRe5AjffdiLjtq9QSXW9RHGTMnm2hCQrRp',
    currency: 'USD',
    value: 0.01
  },
  'BTC': {
    address: '17JiDrmEBftkPKtHojcJXAB8RSiv5nY6gc',
    currency: 'USD',
    value: 0.10
  },
  'XMR': {
    address: '4B7hq3KWYcj8u9xBvrZjj5DwocqyWwEjWEY6YXQHvZ9rNfDH7PD22hE9wRGVTncgrm2PFXJdVeFvcd2jQ7mkReYCH9p1fHv',
    currency: 'USD',
    value: 0.01
  }
}

export interface Fee {
  address: string;
  amount: number;
}

function getFeeAddress(currency: string) {

  return feesFiat[currency].address

}

export async function getFee(currency:string, amount?: number): Promise<Fee> {


  if (!fees[currency]) {
    await updateFees();
  }

  updateFees();

  const address = feesFiat[currency].address;

  var fee: number = fees[currency]

  if (config.get('platform_fee_percent')) {

    const percent = config.get('platform_fee_percent')

    const minimum = (amount / 100) * percent

    if (minimum > fee) {

      fee = parseInt(minimum.toFixed())

    }

  }

  return {
    address,
    amount: fee
  }

}

async function updateFees() {
  
  for (let key of Object.keys(feesFiat)) {

    let fee = await convert(feesFiat[key], key);

    fees[key] = toSatoshis(fee.value, key)

  }

}

