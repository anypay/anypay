
import { models } from '../../lib/models'
import { Orm, findOrCreate } from '../../lib/orm';

import { App } from  '../../lib/apps'
import { Account } from  '../../lib/account'
import { AccessTokenV0 as AccessToken } from  '../../lib/access_tokens'

import { log } from '../../lib/log'

import * as uuid from 'uuid'

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
    throw new Error('Invalid Access Token')
  }

  let app = await models.App.findOne({
    where: { id: accessToken.app_id }
  })

  if (!app) {
    throw new Error('Invalid Access Token')
  }

  if (app.name !== '@wallet-bot') {
    throw new Error('Invalid Access Token')
  }

  let record = await models.WalletBot.findOne({
      where: { app_id: app.id }
  })

  return new WalletBot(record);

}

export async function listWalletBots(account: Account): Promise<WalletBot[]> {

  return WalletBot.find({ where: { account_id: account.id }})

}

export async function findWalletBot(account: Account): Promise<WalletBot | null> {

  return null;

}

export async function createWalletBot(account: Account): Promise<WalletBot> {

  let [app] = await findOrCreate<App>(App, {
    where: {
      name: '@wallet-bot',
      account_id: account.id
    }
  })

  let [walletBot, isNew] = await findOrCreate<WalletBot>(WalletBot, {
    where: {
      app_id: app.id,
      account_id: account.id
    },
    defaults: {
      name: '@wallet-bot',
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

export async function findOrCreateWalletBot(account: Account): Promise<WalletBot> {

  const query = {

    where: {
      account_id: account.id
    },
    defaults: {
      account_id: account.id
    }
  }

  const [walletBot] = await WalletBot.findOrCreate(query)
  
  return walletBot

}

export async function getAccessToken(walletBot: WalletBot): Promise<AccessToken> {

  let [accessToken] = await AccessToken.findOrCreate({

    where: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id')
    },
    defaults: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id')
    }
  })

  return accessToken

}

