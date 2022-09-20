// A `cron` will call the provided default function on the interval given

// export const interval = 'CRON PATTERN'

import { app } from 'anypay'

export default async function({ log, config }) {

  const token = config.get('interval_wallet_bot_access_token')

  const anypay = app(token)

  const address = config.get('interval_wallet_bot_dash_address')

  if (!address) {
    throw new Error('interval_wallet_bot_dash_address config variable required')
  }

  const amount = 0.026

  // ask wallet bot to send payment with two outputs each to the same address
  const request = await anypay.request([{
    currency: 'DASH',
    to: [{
      currency: 'USD',
      amount,
      address
    }, {
      currency: 'USD',
      amount,
      address
    }]
  }])

  log.info('rabbi.cron.wallet_bot_send_dash_on_interval.payment-request.created', request)

}

// on the fifth second
export const pattern = '52 * * * * *'
