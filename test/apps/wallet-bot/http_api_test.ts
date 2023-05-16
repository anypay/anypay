
import { expect, server, account, generateAccount} from '../../utils'

import { createServer } from "../../../apps/wallet-bot/plugin";

import { findOrCreateWalletBot, getAccessToken } from '../../../apps/wallet-bot'
import { ensureInvoice } from '../../../lib/invoices';

describe('Wallet Bot API', () => {

  var walletBotServer;

  before(async () => {

    walletBotServer = await createServer()

  })

  describe('Creating invoices for the wallet bot to pay', () => {

    it('POST /v1/api/apps/wallet-bot/invoices should create an invoice', async () => {

      const { walletBot } = await findOrCreateWalletBot(account)

      const accessToken = await getAccessToken(walletBot)

      const token = await accessToken.get('uid')

      const response = await walletBotServer.inject({
        url: '/v1/api/apps/wallet-bot/invoices',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
        payload: {
          currency: 'BSV',
          to: {
            currency: 'USD',
            amount: 5.20,
            address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
          },
          options: {
            webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
          }
        }
      })

      expect(response.statusCode).to.be.equal(201)

      const invoice = await ensureInvoice(response.result.invoice_uid)

      expect(invoice.status).to.be.equal('unpaid')

      expect(invoice.get('currency')).to.be.equal('BSV')

    })

    it('POST /v1/api/apps/wallet-bot/invoices should return only a single payment option', async () => {

      const { walletBot } = await findOrCreateWalletBot(account)

      const accessToken = await getAccessToken(walletBot)

      const token = await accessToken.get('uid')

      const response = await walletBotServer.inject({
        url: '/v1/api/apps/wallet-bot/invoices',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
        payload: {
          currency: 'BSV',
          to: {
            currency: 'USD',
            amount: 5.20,
            address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
          },
          options: {
            webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
          }
        }
      })

      let optionsResponse = await server.inject({
        method: 'GET',
        url: `/r/${response.result.invoice_uid}`,
        headers: {
          'Accept': 'application/payment-options',
          'x-paypro-version': 2
        }
      })

      expect(optionsResponse.result.paymentOptions.length).to.be.equal(1)

      expect(optionsResponse.result.paymentOptions[0].currency).to.be.equal('BSV')

      expect(optionsResponse.result.paymentOptions[0].chain).to.be.equal('BSV')

      expect(response.statusCode).to.be.equal(201)

    })

    it('GET /v1/api/apps/wallet-bot/unpaid?currency=DASH should list unpaid invoices by currency', async () => {

      const account = await generateAccount()

      const { walletBot } = await findOrCreateWalletBot(account)

      const accessToken = await getAccessToken(walletBot)

      const token = await accessToken.get('uid')

      await walletBotServer.inject({
        url: '/v1/api/apps/wallet-bot/invoices',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
        payload: {
          currency: 'BSV',
          to: {
            currency: 'USD',
            amount: 5.20,
            address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
          },
          options: {
            webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
          }
        }
      })
    
      const dashResponse = await walletBotServer.inject({
        url: `/v0/api/apps/wallet-bot/invoices?status=unpaid&currency=DASH`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
      })

      expect(dashResponse.result.invoices).to.be.an('array')

      expect(dashResponse.result.invoices.length).to.be.equal(0)

      const bsvResponse = await walletBotServer.inject({
        url: `/v0/api/apps/wallet-bot/invoices?status=unpaid&currency=BSV`,
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
      })


      expect(bsvResponse.result.invoices).to.be.an('array')

      expect(bsvResponse.result.invoices.length).to.be.equal(1)

    })

  })

  describe("Cancelling Invoices", () => {

    it.skip('DELETE /v1/api/apps/wallet-bot/invoices/{uid} should cancel invoice', async () => {

      const { walletBot } = await findOrCreateWalletBot(account)

      const accessToken = await getAccessToken(walletBot)

      const token = await accessToken.get('uid')

      const response = await walletBotServer.inject({
        url: '/v1/api/apps/wallet-bot/invoices',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
        payload: {
          currency: 'BSV',
          to: {
            currency: 'USD',
            amount: 5.20,
            address: '1ErZaNaYtbUSfyXK8yc9dvH2ofMpw8r7DT'
          },
          options: {
            webhook_url: 'https://webhooks.anypayx.com/wallet-bot'
          }
        }
      })

      const unpaid = await ensureInvoice(response.result.invoice_uid)

      expect(unpaid.status).to.be.equal('unpaid')

      const { invoice_uid } = response.result

      const cancelResponse = await walletBotServer.inject({
        url: `/v1/api/apps/wallet-bot/invoices/${invoice_uid}`,
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        }
      })

      const cancelled = await ensureInvoice(response.result.invoice_uid)

      expect(cancelled.status).to.be.equal('cancelled')

    })

  })

})
