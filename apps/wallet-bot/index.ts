
import { models } from '../../lib/models'
import { Orm, findOrCreate, findOne, create, findAll } from '../../lib/orm';

import { App } from  '../../lib/apps'
import { Account } from  '../../lib/account'
import { AccessToken } from  '../../lib/access_tokens'

import { log } from '../../lib/log'

import * as uuid from 'uuid'

import { apps, database } from '../../lib';

import { createPaymentRequest, PaymentRequest } from '../../lib/payment_requests';

import { cancelInvoice, ensureInvoice, Invoice } from '../../lib/invoices';

import { BigNumber } from 'bignumber.js'

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

interface PaymentRequestOutput {
  amount: number;
  currency: string;
  address: string;
  script?: string;
}

/*interface PaymentRequestTemplate {
  currency: string;
  to: PaymentRequestOutput[];
}*/

interface InvoiceTemplate {
  currency: string;
  to: PaymentRequestOutput | PaymentRequestOutput[];
}


interface PaymentRequestOptions {
  webhook_url?: string;
  memo?: string;
}

/*
interface CreatePaymentRequest {
  template: PaymentRequestTemplate;
  options?: PaymentRequestOptions;
}
*/

interface CreateInvoice {
  template: InvoiceTemplate;
  options?: PaymentRequestOptions;
}

interface ListInvoices {
  status?: string;
  currency?: string;
  offset?: number;
  limit?: number;
}

export class WalletBot extends Orm {

  static model = models.WalletBot;

  app_id: number;

  static async find(query: any): Promise<WalletBot[]> {

    let records = await WalletBot.model.find(query)

    return records.map(record => new WalletBot(record))

  }

  static findOrCreate(params: any): Promise<[WalletBot, boolean]> {

    return findOrCreate<WalletBot>(WalletBot, params)

  }

  async getInvoice(uid: string): Promise<Invoice> {

    let invoice = await ensureInvoice(uid)


    if (invoice.get('app_id') !== this.get('app_id')) {

      throw new Error("WalletBotGetInvoiceNotAuthorized")
    }

    return invoice

  }

  async createInvoice({ template: invoiceTemplate, options}: CreateInvoice): Promise<PaymentRequest> {

    log.info('wallet-bot.createInvoice', { template: invoiceTemplate, options })

    const to = Array.isArray(invoiceTemplate.to) ? invoiceTemplate.to : [invoiceTemplate.to]

    let result = await createPaymentRequest(
      this.get('app_id'),
      [{
        currency: invoiceTemplate.currency,
        to
      }],
      options
    )

    log.info('wallet-bot.createInvoice.result', { template: invoiceTemplate, options, result })
  
    return result

  }

  async listLatestBalances(): Promise<AddressBalanceUpdate[]> {

    const updates = await models.AddressBalanceUpdate.findAll({
      where: {
        wallet_bot_id: this.get('id')
      },
      attributes: ['chain', 'currency'],
      group: ['chain', 'currency']
    })

    const balances = await Promise.all(updates.map(update => {

      return findOne<AddressBalanceUpdate>(AddressBalanceUpdate, {
        where: {
          chain: update.chain,
          currency: update.currency,
          wallet_bot_id: this.get('id')
        },
        order: [['createdAt', 'desc']]
      })

    }))

    return balances
    
  }

  async listInvoices({ status, currency, offset, limit }: ListInvoices = {}): Promise<Invoice[]> {

    const where = {}

    if (status) {
      where['status'] = status
    }

    if (currency) {
      where['currency'] = currency
    }

    const query = {
      where
    }

    if (offset) {
      query['offset'] = offset
    }

    if (limit) {
      query['limit'] = limit
    }

    return findAll<Invoice>(Invoice, query)

  }

  async createPaymentRequest({ template, options}: any): Promise<PaymentRequest> {

    log.info('wallet-bot.createPaymentRequest', { template, options })

    let result = await createPaymentRequest(
        this.get('app_id'),
        template,
        options   
    )

    log.info('wallet-bot.createPaymentRequest.result', { template, options })

    return result
  }


  async cancelInvoice(uid): Promise<Invoice> {

    let invoice = await ensureInvoice(uid)

    if (invoice.get('app_id') !== this.get('app_id')) {

      throw new Error("WalletBotCancelInvoiceNotAuthorized")
      
    }

    return cancelInvoice(invoice)
  }

  async getAddressHistory({
    address,
    currency,
    chain,
    limit=100,
    offset=0,
    order='desc'
  }: {
    address: string,
    chain: string,
    currency: string,
    limit?: number;
    offset?: number;
    order?: string;
  }): Promise<AddressBalanceUpdate[]> {

    const updates = await findAll<AddressBalanceUpdate>(AddressBalanceUpdate, {
      where: {
        address,
        currency,
        chain,
        wallet_bot_id: this.get('id')
      },
      limit,
      offset,
      order: [['createdAt', order]]
    })

    return updates

  }

  async setAddressBalance(params: SetAddressBalance): Promise<[AddressBalanceUpdate, boolean]> {

    const { chain, currency, balance, address } = params

    const latest = await findOne<AddressBalanceUpdate>(AddressBalanceUpdate, {
      where: {
        chain,
        currency,
        address,
        wallet_bot_id: this.get('id')
      }
    })

    if (latest) {

      let difference = new BigNumber(balance).minus(latest.balance).toNumber()

      if (difference === 0) {

        return [latest, false]

      }

    }

    const update = await create<AddressBalanceUpdate>(AddressBalanceUpdate, {
      chain,
      currency,
      address,
      balance,
      wallet_bot_id: this.get('id')
    })

    return [update, true]

  }

}

export async function loadFromApp({ app }: { app: App }): Promise<WalletBot> {

  if (app.get('name') !== APP_NAME) {
    throw new Error('Invalid Access Token')
  }

  let record = await models.WalletBot.findOne({
      where: { app_id: app.id }
  })

  log.debug('debug.record', record.toJSON())

  return new WalletBot(record);

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

  return loadFromApp({ app })
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

  let [record] = await models.AccessToken.findOrCreate({

    where: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id')
    },
    defaults: {
      account_id: walletBot.get('account_id'),
      app_id: walletBot.get('app_id')
    }
  })

  const account = await findOne<Account>(Account, {
    where: {
      id: walletBot.get('account_id')
    }

  })

  return new AccessToken({record, account})

}

interface PaymentsCounts {
  cancelled: number;
  paid: number;
  unpaid: number;
}

export async function getPaymentCounts(walletBot: WalletBot): Promise<PaymentsCounts> {

  let results = await database.query(`select count(*), status from invoices where app_id = ${walletBot.get('app_id')} group by status`)

  let cancelled = results[0].filter(({status}) => status === 'cancelled')[0]

  if (!cancelled) {

    cancelled = 0

  } else {

    cancelled = parseInt(cancelled['count'])

  }

  let paid = results[0].filter(({status}) => status === 'paid')[0]

  if (!paid) {

    paid = 0

  } else {

    paid = parseInt(paid['count'])

  }

  let unpaid = results[0].filter(({status}) => status === 'unpaid')[0]

  if (!unpaid) {

    unpaid = 0

  } else {

    unpaid = parseInt(unpaid['count'])

  }

  return {
    cancelled,
    paid,
    unpaid
  }

}

interface SetAddressBalance {
  chain: string;
  currency: string;
  address: string;
  balance: number;
}

export class AddressBalanceUpdate extends Orm {

  static model = models.AddressBalanceUpdate

  get difference(): number {

    return this.get('difference')

  }

  get chain(): string {

    return this.get('chain')

  }

  get currency(): string {

    return this.get('currency')

  }

  get address(): string {

    return this.get('address')

  }

  get balance(): number {

    return this.get('balance')

  }


}



