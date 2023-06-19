
import { convert } from '../prices';

import { BigNumber } from 'bignumber.js';

import { toSatoshis } from '../plugins'

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
  },
  'USDC_MATIC': {
    currency: 'USD',
    value: 0.01
  },
  'USDT_MATIC': {
    currency: 'USD',
    value: 0.01
  },
  'MATIC': {
    currency: 'USD',
    value: 0.01
  }
}

export interface Fee {
  address: string;
  amount: number;
}

const feeAddresses = {
  'BTC': '3PSFeZrEj1eSeFKs6cwYiU9Y4frfKati8L',
  'ETH': '0x8a3fe74311084e6f71ef9fc04bc6481e257a7325',
  'LTC': 'MGzgGYeni8WZ6Hc2iqd3vWwQRKa7wkf4GG',
  'BCH': 'qravv0seavret7g3mpfpx9yupuzff0nhjvc506v2z2',
  'DASH': 'XjPLAKYmLtHNmWiKhy3vSHFn3Yh9NaRnvu',
  'BSV': '12XdPcmqkJCLFhEZccTw2xP33vqYh8mhfu',
  'DOGE': 'DSrL49Fo6qD3GwAHeBDvmZMa4g27YpMyz8',
  'XMR': '42DxjbzjtQtFo59BwvjSjbA3FXAwV9ESn3zbkuU8fJYoPzQW7dGdZ3sAzyvz8Zcc1p9MZkLyMUU8EiU7xWJyYcURUaswNrQ',
  'XRP': 'rasrvYBgXKEopSrkhmiZ97zk2DkTKo1pgK',
  'SOL': 'CN8Hchkypid7g55B3fTBZMxyN73Z656RGQQt9YJmcUiA',
  'AVAX': '0x8881c5306fec0a4f6b829e39f0ffbb6c4a9faa05'
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

  return {

    address: feeAddresses[currency],

    amount: Math.trunc(fee)
  }

}

async function updateFees() {
  
  for (let key of Object.keys(feesFiat)) {

    let [currency, chain] = key.split('_')

    if (!chain) { chain = currency }

    const fee = await convert(feesFiat[key], currency);

    fees[key] = toSatoshis({ decimal: fee.value, currency, chain })

  }

}

