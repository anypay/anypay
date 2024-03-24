

// A `cron` will call the provided default function on the interval given

// export const interval = 'CRON PATTERN'

import { app } from 'anypay'

// https://askbitcoin.ai/questions/60d47f7c7295889af423385922324764144f7fa7eb003f69ef733b3bb32d6fcc

import axios from 'axios'

export default async function({ log, config }) {

  return

  const content = config.get('BOOSTPOW_WALLET_BOT_CONTENT_TXID')

  const { data: bip270 } = await axios.get(`https://askbitcoin.ai/api/v1/boostpow/${content}/new?currency=USD&value=0.052`)

  const address = bip270.outputs[0].script

  const token = config.get('INTERVAL_WALLET_BOT_ACCESS_TOKEN')

  const anypay = app(token)

  if (!address) {
    throw new Error('BOOSTPOW_WALLET_BOT_CONTENT_TXID config variable required')
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

// every five seconds
export const pattern = '*/52 * * * * *'