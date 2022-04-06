
import { Orm } from '../../../lib/orm'

import { Account } from '../../../lib/account'

import { models } from '../../../lib/models'

import { log } from '../../../lib/log'

import { convert } from '../../../lib/prices'

import * as krakenLib from '../lib'

import * as KrakenClient from 'kraken-api'

export class KrakenAccount extends Orm {

  account: Account;

  client: KrakenClient;

  constructor(record: any, account) {

    super(record);

    this.account = account

    this.client = new KrakenClient(

      record.api_key, record.api_secret

    );

  }

  static async fromAccount(account: Account) {

    let record = await models.KrakenAccount.findOne({

      where: { account_id: account.id }

    })

    return new KrakenAccount(record, account)

  }

  async api(method: string, params: any={}) {

    return this.client.api(method, params)

  }

  async listBalances(): Promise<KrakenBalance[]> {

    return krakenLib.getBalancesBreakdown(this.client)

  }

  async depositsStatus(asset: string): Promise<KrakenDeposit[]> {

    let deposits = await this.client.depositStatus({ asset })

    return deposits

  }

  async sellAll(): Promise<any> {

    let { result: balances } = await this.api('Balance')

    let { result: assetPairs } = await this.api('AssetPairs')

    log.debug('kraken.balances', balances)

    let currencies = this.get('autosell')

    if (currencies.length === 0) {
 
      log.debug('kraken.autosell.currencies.empty', {
        account_id: this.get('account_id')
      })

      return []

    }

    if (currencies[0] === '*') {

      log.debug('kraken.autosell.currencies.all', {
        account_id: this.get('account_id')
      })

      currencies = Object.keys(balances).filter(currency => {

        var pair;

        try {

          if (currency.match('USD')) return false

          let balance = parseFloat(balances[currency])

          if (balance == 0) return false 

          pair = `${currency}USD`

          if (pair.match(/^X/) && currency !== 'XRP') {
            pair = pair.slice(1)
          }

          if (currency === 'XXBT') {
            pair = 'XXBTZUSD'
          }

          if (currency === 'XXRP') {
            pair = 'XXRPZUSD'
          }

          if (currency === 'LTC') {
            pair = 'XLTCZUSD'
          }

          if (pair === 'LTCUSD') {
            pair = 'XLTCZUSD'
          }

          let minimum = parseFloat(assetPairs[pair].ordermin)

          if (balance < minimum) {

            log.debug('kraken.autosell.lowbalance', { balance, minimum, pair })

            return false
          }

          return true

        } catch(error) {

          error.pair = pair

          log.error('kraken.autosell.error', error)

          return false

        }

      })

    }

    let trades = []

    for (let currency of currencies) {

      try {

        log.debug('kraken.autosell.currency', {
          currency,
          account_id: this.get('account_id'),
          balance: balances[currency]
        })

        const balance = parseFloat(balances[currency])

        if (currency.match(/^X/)) {
          currency = currency.slice(1)
        }

        let trade = await krakenLib.sellAllOfPair(this.client, `${currency}USD`, balance)

        log.info('kraken.order.created', Object.assign(trade, {account_id: this.get('account_id')}))

        trades.push(trade)

      } catch(error) {

        log.error('kraken.autosell.currency.error', error)

      }

    } 

    return trades

  }

}

interface KrakenBalance {
  currency: string;
  balance: number;
  locked: number;
  available: number;
}

interface KrakenDeposit {
  method: string;
  aclass: string;
  asset: string;
  refid: string;
  txid: string;
  info: string;
  amount: number;
  fee: number;
  time: number;
  status: string;
}

export async function fromAccount(account: Account) {

  let record = await models.KrakenAccount.findOne({

    where: { account_id: account.id }

  })

  return new KrakenAccount(record, account)

}

export async function listAll() {

  let records = await models.KrakenAccount.findAll({
    includes: [{
      model: models.Account,
      as: 'account'
    }]
  })

  return records.map(record => {

    return new KrakenAccount(record, record.account)

  })

}

