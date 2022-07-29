
import * as utils from '../utils'

import { TestClient } from 'anypay-simple-wallet'

import { expect, spy, wallet, server } from '../utils'

import { protocol, schema } from '../../lib/pay/json_v2'

import { log } from '../../lib/log'

import { ensureInvoice } from '../../lib/invoices'

describe('JSON Payment Protocol V2', () => {

  var account, invoice;

  beforeEach(() => {spy.on(log, 'info') })

  before(async () => {

    var result = await utils.newAccountWithInvoice()

    account = result[0]

    invoice = result[1]

  })

  it('#listPaymentOptions should invoice payment options', async () => {


    log.debug('account.created', account)

    let response = await protocol.listPaymentOptions(invoice)

    let validation = schema.Protocol.PaymentOptions.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#listPaymentOptions record an event in the invoice event log', async () => {

    let {account, invoice} = await utils.newAccountWithInvoice()

    log.debug('account.created', account)

    await protocol.listPaymentOptions(invoice)

    expect(log.info).to.have.been.called.with('pay.jsonv2.payment-options')

  })

  it('#getPaymentRequest returns a payment request', async () => {

    let {account, invoice} = await utils.newAccountWithInvoice()

    log.debug('account.created', account)

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let response = await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let validation = schema.Protocol.PaymentRequest.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#getPaymentRequest should reject for unsupported currency', async () => {

    expect(

      protocol.getPaymentRequest(invoice, {
        currency: 'INVALID',
        chain: 'main'
      })

    ).to.be.eventually.rejectedWith('Unsupported Currency or Chain for Payment Option')

  })

  it('#getPaymentRequest records an event in the invoice event log', async () => {
    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    await protocol.getPaymentRequest(invoice, paymentOptions[0])

    expect(log.info).to.have.been.called.with('pay.jsonv2.payment-request')
  })

  it('#verifyUnsignedPayment records an event in the invoice event log', async () => {

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let { chain, currency } = paymentOptions[0]

    await protocol.verifyUnsignedPayment(invoice, {

      chain,

      currency,

      transactions: []

    })

    expect(log.info).to.have.been.called.with('pay.jsonv2.payment-verification')

  })

  if (!process.env.SKIP_E2E_PAYMENTS_TESTS) {

    it('#sendSignedPayment should accept and broadcast transaction', async () => {

      let {paymentOptions} = await protocol.listPaymentOptions(invoice)

      let { chain, currency } = paymentOptions[0]

      await protocol.getPaymentRequest(invoice, { chain, currency })

    })

    it('#sendSignedPayment should mark invoice as paid', async () => {

      let {account, invoice} = await utils.newAccountWithInvoice({ amount: 0.02 })
      log.debug('account.created', account)

      let client = new TestClient(server, `/i/${invoice.uid}`)

      let { paymentOptions } = await client.getPaymentOptions()

      let paymentOption = paymentOptions.filter(option => {
        return option.currency === 'BSV'
      })[0]

      let { chain, currency } = paymentOption

      let paymentRequest = await client.selectPaymentOption(paymentOption)

      await wallet.getBalance()

      let payment = await wallet.buildPayment(paymentRequest.instructions[0].outputs)

      await protocol.sendSignedPayment(invoice, {

        chain,

        currency,

        transactions: [{ tx: payment }]

      })

      invoice = await ensureInvoice(invoice.uid)

      expect(invoice.get('status')).to.be.equal('paid')

    })

    it('#sendSignedPayment records an event in the invoice evenet log', async () => {

      let {account, invoice} = await utils.newAccountWithInvoice({ amount: 0.02 })

      log.debug('account.created', account)

      let {paymentOptions} = await protocol.listPaymentOptions(invoice)

      let { chain, currency } = paymentOptions[0]

      await protocol.getPaymentRequest(invoice, { chain, currency })

      await protocol.sendSignedPayment(invoice, {

        chain,

        currency,

        transactions: []

      })

      expect(log.info).to.have.been.called.with('pay.jsonv2.payment')

    })

  }

})

