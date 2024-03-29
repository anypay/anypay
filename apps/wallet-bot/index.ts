

import {
  Apps as App,
  accounts as Account,
  access_tokens as AccessToken,
  invoices as Invoice,
  WalletBots,
  WalletBots as WalletBot,
  AddressBalanceUpdates as AddressBalanceUpdate,
  
} from '@prisma/client'

export { WalletBot }

import { log } from '../../lib/log'

//import { database } from '../../lib';

import { createPaymentRequest as _createPaymentRequest } from '../../lib/payment_requests';
import { PaymentRequests as PaymentRequest } from '@prisma/client'

import { cancelInvoice as _cancelInvoice } from '../../lib/invoices';

import { BigNumber } from 'bignumber.js'

import prisma from '../../lib/prisma';

import { createApp } from '../../lib/apps';

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

export async function createInvoice(walletBot: WalletBots, { template, options}: CreateInvoice): Promise<PaymentRequest> {

  log.info('wallet-bot.createInvoice', { template, options })

  const to = Array.isArray(template.to) ? template.to : [template.to]

  if (!walletBot.app_id) {
      
      throw new Error('WalletBotNotAuthorized')
  }

  let result = await _createPaymentRequest(
    walletBot.app_id,
    [{
      currency: template.currency,
      to
    }],
    options
  )

  log.info('wallet-bot.createInvoice.result', { template, options, result })

  return result

}

export async function getInvoice(walletBot: WalletBots, uid: string): Promise<Invoice> {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid
    }
  })

  if (invoice.app_id != walletBot.app_id) {
      
      throw new Error('WalletBotNotAuthorized')
  
    }
  return invoice

}

export async function listLatestBalances(walletBot: WalletBots): Promise<AddressBalanceUpdate[]> {
  
    const updates = await prisma.addressBalanceUpdates.groupBy({
      by: ['chain', 'currency'],
      _count: true,
    });
  
    const balances = await Promise.all(updates.map((update: any) => {
  
      return prisma.addressBalanceUpdates.findFirstOrThrow({
        where: {
          wallet_bot_id: walletBot.id,
          chain: update.chain,
          currency: update.currency
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }))
  

    return balances
  
}

export async function listInvoices(walletBot: WalletBots, { status, currency, offset, limit }: ListInvoices = {}): Promise<Invoice[]> {

  const where: {
    status?: string,
    currency?: string
  } = {}

  if (status) {
    where['status'] = status
  }

  if (currency) {
    where['currency'] = currency
  }

  return prisma.invoices.findMany({
    where,
    take: limit || 100,
    skip: offset
  })

}

export async function createPaymentRequest(walletBot: WalletBots, { template, options}: any): Promise<PaymentRequest> {
  log.info('wallet-bot.createPaymentRequest', { template, options })

  let result = await _createPaymentRequest(
      Number(walletBot.app_id),
      template,
      options   
  )

  log.info('wallet-bot.createPaymentRequest.result', { template, options })

  return result
}

export async function cancelInvoice(walletbot: WalletBots, uid: string): Promise<Invoice> {
  
    let invoice = await prisma.invoices.findFirstOrThrow({
      where: {
        uid
      }
    })
  
    if (invoice.app_id !== walletbot.app_id) {
  
      throw new Error('WalletBotNotAuthorized')
    }
  
    return _cancelInvoice(invoice)
  
}

export async function getAddressHistory(walletBot: WalletBots, { address, currency, chain}: { address: string, currency: string, chain: string }): Promise<AddressBalanceUpdate[]> {

  return prisma.addressBalanceUpdates.findMany({
    where: {
      address,
      currency,
      chain,
      wallet_bot_id: walletBot.id
    }
  })

}

export async function setAddressBalance(walletBot: WalletBots, params: SetAddressBalance): Promise<[AddressBalanceUpdate, boolean]> {

  const { chain, currency, balance, address } = params

  const latest = await prisma.addressBalanceUpdates.findFirst({
    where: {
      chain,
      currency,
      address,
      wallet_bot_id: walletBot.id
    }
  })

  if (latest) {

    let difference = new BigNumber(balance).minus(Number(latest.balance)).toNumber()

    if (difference === 0) {

      return [latest, false]

    }

  }

  const update = await prisma.addressBalanceUpdates.create({
    data: {
      chain,
      currency,
      address,
      balance,
      wallet_bot_id: walletBot.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })

  return [update, true]


}

export async function loadFromApp({ app }: { app: App }): Promise<WalletBots> {

  if (app.name !== APP_NAME) {
    throw new Error('Invalid Access Token')
  }

  console.log('CORRECT APP NAME', app)

  return prisma.walletBots.findFirstOrThrow({
    where: {
      app_id: app.id
    }
  })

}

export async function getWalletBot({ token }: {token: string}): Promise<WalletBots> {

  const accessToken = await prisma.access_tokens.findFirstOrThrow({
    where: {
      uid: token
    }
  })

  if (!accessToken.app_id) {

    log.debug('wallet-bot.access-token.invalid', { reason: 'no app_id'})

    throw new Error('Invalid Access Token')
  }

  const app = await prisma.apps.findFirstOrThrow({
    where: {
      id: accessToken.app_id
    }
  })

  return loadFromApp({ app })
}

export async function listWalletBots(account: Account): Promise<WalletBots[]> {

  return prisma.walletBots.findMany({
    where: {
      account_id: account.id
    }
  })

}

export async function createWalletBot(account: Account): Promise<WalletBots> {

  log.debug('create wallet bot', account)

  let app = await prisma.apps.findFirst({
    where: {
      name: APP_NAME,
      account_id: account.id
    }
  })

  if (!app) {
      
      app = await createApp({
        account_id: account.id,
        name: APP_NAME
      })

  }

  let walletBot = await prisma.walletBots.findFirst({
    where: {
      app_id: app.id,
      account_id: account.id
    }
  })

  const isNew: boolean = true

  if (!walletBot) {
      
      walletBot = await prisma.walletBots.create({
        data: {
          app_id: app.id,
          account_id: account.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
  
    }

  if (isNew) {

    log.info('wallet-bot.created', walletBot)
  }

  return walletBot

}

export async function findOrCreateWalletBot(account: Account): Promise<{walletBot: WalletBots, app: App }> {


  const existingBot = await prisma.walletBots.findFirst({
    where: {
      account_id: account.id
    }
  })

  if (existingBot) {

    const app = await prisma.apps.findFirstOrThrow({
      where: {
        account_id: account.id,
        name: APP_NAME
      }
    })

    return {walletBot: existingBot, app}

  } else {
      
      const app = await createApp({
        account_id: account.id,
        name: APP_NAME      
      })
  
      const walletBot = await prisma.walletBots.create({
        data: {
          account_id: account.id,
          app_id: app.id,
          name: APP_NAME,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
  
      return { walletBot, app }
  }



}

export async function getAccessToken(walletBot: WalletBots): Promise<AccessToken> {

  let record = await prisma.access_tokens.findFirst({
    where: {
      account_id: Number(walletBot.account_id),
      app_id: walletBot.app_id
    }
  })

  if (!record){ 
      
      record = await prisma.access_tokens.create({
        data: {
          account_id: Number(walletBot.account_id),
          app_id: walletBot.app_id,
          uid: uuid.v4(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
  }

  return record;

}

interface PaymentsCounts {
  cancelled: number;
  paid: number;
  unpaid: number;
}

export async function getPaymentCounts(walletBot: WalletBots): Promise<PaymentsCounts> {

  return {
    cancelled: 0,
    paid: 0,
    unpaid: 0
  }

  /*

  let results = await database.query(`select count(*), status from invoices where app_id = ${walletBot.app_id} group by status`)

  let cancelled = results[0].filter(({status}: { status: string}) => status === 'cancelled')[0]

  if (!cancelled) {

    cancelled = 0

  } else {

    cancelled = parseInt(cancelled['count'])

  }

  let paid = results[0].filter(({status}: { status: string}) => status === 'paid')[0]

  if (!paid) {

    paid = 0

  } else {

    paid = parseInt(paid['count'])

  }

  let unpaid = results[0].filter(({status}: {status: string}) => status === 'unpaid')[0]

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

  */

}

interface SetAddressBalance {
  chain: string;
  currency: string;
  address: string;
  balance: number;
}



