

// A `cron` will call the provided default function on the interval given

// export const interval = 'CRON PATTERN'

import { app } from 'anypay'

// https://askbitcoin.ai/questions/60d47f7c7295889af423385922324764144f7fa7eb003f69ef733b3bb32d6fcc

import axios from 'axios'

export default async function({ log, config }) {

  const content = config.get('boostpow_wallet_bot_content_txid')

  const { data: bip270 } = await axios.get(`https://askbitcoin.ai/api/v1/boostpow/${content}/new?currency=USD&value=0.052`)

  const address = bip270.outputs[0].script

  const token = config.get('interval_wallet_bot_access_token')

  const anypay = app(token)

  if (!address) {
    throw new Error('boostpow_wallet_bot_content_txid config variable required')
  }

  // ask wallet bot to send payment with two outputs each to the same address
  const request = await anypay.request([{
    currency: 'BSV',
    to: [{
      currency: 'USD',
      amount: 0.052,
      address
    }]
  }])

  log.info('rabbi.cron.boostpow_wallet_bot_send_on_interval.payment-request.created', request)

}

// every hour on the 52nd minute
export const pattern = '0 */52 * * * *'
