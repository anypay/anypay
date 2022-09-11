
import { models } from '../../lib/models'
import { Orm, findOrCreate, findOne, create } from '../../lib/orm';

import { App } from  '../../lib/apps'
import { Account } from  '../../lib/account'
import { AccessTokenV0 as AccessToken } from  '../../lib/access_tokens'

import { log } from '../../lib/log'

import * as uuid from 'uuid'
import { apps, database } from '../../lib';

// Wallet Bot Events
// It should receive the following events:
// - wallet-bot.connected
// - wallet-bot.disconnected
// - wallet-bot.activated
// - wallet-bot.deactivated
// - wallet-bot.invoice.created
// - wallet-bot.invoice.cancelled
// - wallet-bot.invoice.paid
// - wallet-bot.address.updated
// - wallet-bot.address.removed
// - wallet-bot.address.balance.updated
// - wallet-bot.authenticated
//
// It should also send the following events:
// - wallet-bot.authenticate
// - wallet-bot.status.online
// - wallet-bot.status.offline
// - wallet-bot.balance.update
// - wallet-bot.address.update
// - wallet-bot.address.remove
//
// Events related to a wallet bot may be routed to it via amqp bindings. When a wallet bot
// socket.io connection is established it shall create a temporary queue into which will be
// routed all events related to that wallet bot. Other components in the system may send
// messages down to the wallet but by publishing to the routing key `wallet-bots.${id}.events`.
// Relevant events shall be validated and sent along to the websocket if connected. Upon dis-
// connection of the websocket the queue shall be released from amqp.

const APP_NAME = '@wallet-bot'

export class WalletBot extends Orm {

  static model = models.WalletBot;

  static async find(query: any): Promise<WalletBot[]> {

    let records = await WalletBot.model.find(query)

    return records.map(record => new WalletBot(record))

  }

  static findOrCreate(params: any): Promise<[WalletBot, boolean]> {

    return findOrCreate<WalletBot>(WalletBot, params)

  }

}

export async function getWalletBot({ token }: {token: string}): Promise<WalletBot> {

  let accessToken = await models.AccessToken.findOne({
    where: { uid: token }
  })

  if (!accessToken) {
    throw new Error('Invalid Access Token')
  }

  if (!accessToken.app_id) {

    log.debug('wallet-bot.access-token.invalid', { reason: 'no app_id'})

    throw new Error('Invalid Access Token')
  }

  let app = await models.App.findOne({
    where: { id: accessToken.app_id }
  })

  if (!app) {
    throw new Error('Invalid Access Token')
  }

  if (app.name !== APP_NAME) {
    throw new Error('Invalid Access Token')
  }

  let record = await models.WalletBot.findOne({
      where: { app_id: app.id }
  })

  log.debug('debug.record', record.toJSON())

  return new WalletBot(record);

}

export async function listWalletBots(account: Account): Promise<WalletBot[]> {

  return WalletBot.find({ where: { account_id: account.id }})

}

export async function findWalletBot(account: Account): Promise<WalletBot | null> {

  return null;

}

export async function createWalletBot(account: Account): Promise<WalletBot> {

  log.debug('create wallet bot', account)

  let [app] = await findOrCreate<App>(App, {
    where: {
      name: APP_NAME,
      account_id: account.id
    }
  })

  log.debug('app', app)

  let [walletBot, isNew] = await findOrCreate<WalletBot>(WalletBot, {
    where: {
      app_id: app.id,
      account_id: account.id
    },
    defaults: {
      name: APP_NAME,
      app_id: app.id,
      account_id: account.id,
      identifier: uuid.v4()
    }
  })

  if (isNew) {

    log.info('wallet-bot.created', walletBot)
  }

  return walletBot

}

export async function findOrCreateWalletBot(account: Account): Promise<{walletBot: WalletBot, app: App }> {

  const existingBot = await findOne<WalletBot>(WalletBot, {
    where: {
      account_id: account.id
    }
  })

  if (existingBot) {

    const app = await apps.findOne({
      account_id: account.id,
      name: APP_NAME
    })

    return {walletBot: existingBot, app}

  }

  const app = await apps.createApp({
    account_id: account.id,
    name: APP_NAME
  })

  const walletBot = await create<WalletBot>(WalletBot, {
    account_id: account.id,
    name: APP_NAME,
    app_id: app.id
  })
  
  return { walletBot, app }

}

export async function getAccessToken(walletBot: WalletBot): Promise<AccessToken> {

  let [accessToken] = await findOrCreate<AccessToken>(AccessToken, {

    where: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id')
    },
    defaults: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id'),
      name: APP_NAME
    }
  })

  return accessToken

}

export async function getPaymentCounts(walletBot: WalletBot): Promise<any> {

  let results = await database.query(`select count(*), status from invoices where app_id = ${walletBot.get('app_id')} group by status`)

  return results[0]

}

