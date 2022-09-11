
export { plugin as hapi } from './hapi'

import { fromAccount } from './lib/kraken_account'

import { Account } from '../../lib/account'

import { models } from '../../lib/models'

import { log } from '../../lib/log'

const currencies = [
  'XBT',
  'DASH',
  'BCH',
  'XMR',
  'XDG',
  'LTC'
]

export async function syncDeposits(account: Account) {

  let kraken = await fromAccount(account)

  const result = []

  for (let asset of currencies) {

    let { result: deposits } = await kraken.api('DepositStatus', {
      asset
    })

    for (let deposit of deposits) {

      let [record, isNew] = await models.KrakenDeposit.findOrCreate({
        where: {
          refid: deposit.refid,
          account_id: account.id,
          kraken_account_id: kraken.get('id'),
          status: deposit.status
        },
        defaults: deposit
      })

      if (isNew) {

        log.info('kraken.deposit.created', record.toJSON())

        result.push(record)
      }

    }

  }

  return result

}

interface SyncTradesOptions {
  start?: number;
  end?: number;
  ofs?: number;
  type?: string;
  trades?: boolean;
}

export async function syncTrades(account: Account, options: SyncTradesOptions={}) {

  let latestTrade = await models.KrakenTrade.findOne({
    where: {
      account_id: account.id
    },
    order: [['time', 'desc']],
    limit: 1
  })

  if (latestTrade) {
    options['start'] = parseFloat(latestTrade.time)
  }

  console.log({ options })

  let kraken = await fromAccount(account)

  const newTrades = []

  for (let _ of currencies) {

    let { result } = await kraken.api('TradesHistory', options)

    let trades = Object.keys(result.trades).map(tradeid => {

      let trade = result.trades[tradeid]

      return Object.assign(trade, { tradeid, account_id: account.id })

    })

    for (let trade of trades) {

      let [record, isNew] = await models.KrakenTrade.findOrCreate({
        where: {
          tradeid: trade.tradeid,
          account_id: account.id
        },
        defaults: trade
      })

      if (isNew) {

        log.info('kraken.trade.created', record.toJSON())

        newTrades.push(trade)

      }

    }

    console.log(`${newTrades.length} new trades`)

  }

  return newTrades

}

