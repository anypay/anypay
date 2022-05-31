
export { plugin as hapi } from './hapi'

import { KrakenAccount, listAll, fromAccount } from './lib/kraken_account'

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


