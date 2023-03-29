require('dotenv').config()

const address = '43iJfB8tYGFCBNEc8rjJnWHfrXzUapbeifsmS5S9wBEPEzGBCgogtCZSkHaU68UBMWG5pRXk56g7CekSZo7bYkyuNq52Dtn'

const view_key = 'f30ef174be8249eb57a0a215339ae653f3c1034bb1e8eb76fa32b83b817fa10b'

import { setAddress } from '../../lib/addresses'

import { createInvoice } from '../../lib/invoices'

import { findPaymentOption } from '../../lib/payment_option'

import * as PayProtocol from '../../lib/pay/json_v2/protocol'

import * as utils from '../utils'

import { expect, spy } from '../utils'

import * as plugin from '../../plugins/xmr'

describe("Monero XMR", () => {

  describe("Account / Address Setup", () => {

    it('accepts  both address and view key', async () => {

      let account = await utils.createAccount()

      let record = await setAddress(account, {
        currency: 'XMR',
        view_key,
        value: address
      })

      expect(record.get('id')).to.be.greaterThan(0)

      expect(record.get('account_id')).to.be.equal(account.id)

      expect(record.get('view_key')).to.be.equal(view_key)

      expect(record.get('value')).to.be.equal(address)

    })

  })

  describe("Payments", () => {

    var account;

    before(async () => {

      account = await utils.createAccount() 

      await setAddress(account, {
        currency: 'XMR',
        value: address,
        view_key
      })

    })

    it('generates an invoice with monero payment option', async () => {

      let invoice = await createInvoice({
        account,
        amount: 10
      })

      let option = await findPaymentOption({invoice, currency: 'XMR', chain: 'XMR' })

      expect(option.get('id')).to.be.greaterThan(0)

      expect(option.amount).to.be.greaterThan(0)

      expect(option.get('currency')).to.be.equal('XMR')

      expect(option.get('outputs').length).to.be.equal(2)

    })
 
    it('a wallet chooses xmr on the "payment-option" call', async () => {

      let invoice = await createInvoice({
        account,
        amount: 10
      })

      let { paymentOptions } = await PayProtocol.listPaymentOptions(invoice)

      let monero = paymentOptions.filter(option => {
        return option.currency === 'XMR'
      })[0]

      let paymentRequest = await PayProtocol.getPaymentRequest(invoice, monero)

      expect(paymentRequest.chain).to.be.equal('XMR')

      expect(paymentRequest.network).to.be.equal('main')

      expect(paymentRequest.instructions).to.be.an('array')

    })

    it('calls plugin.validateUnsignedTx on "payment-verification" call', async () => {

      let invoice = await createInvoice({
        account,
        amount: 10
      })

      let { paymentOptions } = await PayProtocol.listPaymentOptions(invoice)

      let monero = paymentOptions.filter(option => {
        return option.currency === 'XMR'
      })[0]

      await PayProtocol.getPaymentRequest(invoice, monero)

      spy.on(plugin, ['validateUnsignedTx'])

      let unsignedTransaction = '123456'

      await PayProtocol.verifyUnsignedPayment(invoice, {
        chain: 'XMR',
        currency: 'XMR',
        transactions: [{ tx: unsignedTransaction }]
      })

      expect(plugin.validateUnsignedTx).to.have.been.called()

    })

    it('calls plugin.broadcastTx on "payment" call', async () => {


      spy.on(plugin, ['broadcastTx'])

      let invoice = await createInvoice({
        account,
        amount: 10
      })

      let { paymentOptions } = await PayProtocol.listPaymentOptions(invoice)

      let monero = paymentOptions.filter(option => {
        return option.currency === 'XMR'
      })[0]

      await PayProtocol.getPaymentRequest(invoice, monero)

      spy.on(plugin, ['validateUnsignedTx'])

      let unsignedTransaction = '123456'

      await PayProtocol.verifyUnsignedPayment(invoice, {
        chain: 'XMR',
        currency: 'XMR',
        transactions: [{ tx: unsignedTransaction }]
      })

      expect(plugin.validateUnsignedTx).to.have.been.called()

      let signedTransaction = '123456734343'

      try {

        await PayProtocol.sendSignedPayment(invoice, {
          currency: "XMR",
          chain: "XMR",
          transactions: [{ tx: signedTransaction }]
        })
      } catch(error) {

        console.log(error.message)

      }

      expect(plugin.broadcastTx).to.have.not.been.called()

    })

    it.skip('actually broadcasts valid transactions to the network')
    it.skip('rejects broadcasting invalid transactions to the network')

  })

})
