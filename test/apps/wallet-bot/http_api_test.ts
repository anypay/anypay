
import { expect, generateAccount, server, createAccountWithAddresses} from '../../utils'

import { createServer } from "../../../apps/wallet-bot/plugin";

import { findOrCreateWalletBot, getAccessToken } from '../../../apps/wallet-bot'

describe('Wallet Bot API', () => {

  var walletBotServer;

  before(async () => {

    walletBotServer = await createServer()

  })

  describe('Creating invoices for the wallet bot to pay', () => {

    it('POST /v1/api/apps/wallet-bot/invoices should create an invoice', async () => {

      const account = await generateAccount()

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

    })

    it('POST /v1/api/apps/wallet-bot/invoices should return only a single payment option', async () => {

      const account = await createAccountWithAddresses()

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
        url: `/r/${response.result.uid}`,
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

    it('GET /v1/api/apps/wallet-bot/unpaid should list unpaid invoices', async () => {

      const account = await generateAccount()

      const { walletBot } = await findOrCreateWalletBot(account)

      const accessToken = await getAccessToken(walletBot)

      const token = await accessToken.get('uid')

      const response = await walletBotServer.inject({
        url: '/v1/api/apps/wallet-bot/unpaid',
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${token}:`).toString('base64')}`
        },
      })

      console.log(response.body)

      expect(response.statusCode).to.be.equal(200)

    })

  })

})

