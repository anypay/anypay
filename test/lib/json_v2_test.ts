
import * as utils from '../utils'

import { TestClient } from 'anypay-simple-wallet'

import { expect, spy, wallet, server } from '../utils'

import { protocol, schema, log } from '../../lib/pay/json_v2'

import { ensureInvoice } from '../../lib/invoices'

describe('JSON Payment Protocol V2', () => {

  beforeEach(() => {spy.on(log, 'info') })

  it('#listPaymentOptions should invoice payment options', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await protocol.listPaymentOptions(invoice)

    let validation = schema.Protocol.PaymentOptions.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#listPaymentOptions record an event in the invoice event log', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let response = await protocol.listPaymentOptions(invoice)

    expect(log.info).to.have.been.called.with('pay.jsonv2.paymentoptions')

  })

  it('#getPaymentRequest returns a payment request', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let response = await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let validation = schema.Protocol.PaymentRequest.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#getPaymentRequest should reject for unsupported currency', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice();

    expect(

      protocol.getPaymentRequest(invoice, {
        currency: 'INVALID',
        chain: 'main'
      })

    ).to.be.eventually.rejectedWith('Unsupported Currency or Chain for Payment Option')

  })

  it('#getPaymentRequest records an event in the invoice event log', async () => {
    let [account, invoice] = await utils.newAccountWithInvoice()

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let response = await protocol.getPaymentRequest(invoice, paymentOptions[0])

    expect(log.info).to.have.been.called.with('pay.jsonv2.paymentrequest')
  })

  it('#verifyUnsignedPayment should verify valid payment', async () => {
    let [account, invoice] = await utils.newAccountWithInvoice()
  })

  it('#verifyUnsignedPayment should reject invalid payment', async () => {
    let [account, invoice] = await utils.newAccountWithInvoice()
  })

  it('#verifyUnsignedPayment records an event in the invoice event log', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let response = await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let { chain, currency } = paymentOptions[0]

    await protocol.verifyUnsignedPayment(invoice, {

      chain,

      currency,

      transactions: []

    })

    expect(log.info).to.have.been.called.with('pay.jsonv2.paymentverification')

  })

  it('#sendSignedPayment should accept and broadcast transaction', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice()

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let { chain, currency } = paymentOptions[0]

    let response = await protocol.getPaymentRequest(invoice, { chain, currency })

  })

  it('#sendSignedPayment should mark invoice as paid', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let { chain, currency } = paymentOptions[0]

    let paymentRequest = await client.selectPaymentOption(paymentOptions[0])

    let balance = await wallet.getBalance()

    let payment = await wallet.buildPayment(paymentRequest.instructions[0].outputs)

    console.log('__PAY', payment)

    let result = await protocol.sendSignedPayment(invoice, {

      chain,

      currency,

      transactions: [{ tx: payment }]

    })

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.get('status')).to.be.equal('paid')

  })

  it('#sendSignedPayment records an event in the invoice evenet log', async () => {

    let [account, invoice] = await utils.newAccountWithInvoice({ amount: 0.02 })

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let { chain, currency } = paymentOptions[0]

    let response = await protocol.getPaymentRequest(invoice, { chain, currency })

    await protocol.sendSignedPayment(invoice, {

      chain,

      currency,

      transactions: []

    })

    expect(log.info).to.have.been.called.with('pay.jsonv2.payment')

  })

})

