/*
    This file is part of anypay: https://github.com/anypay/anypay
    Copyright (c) 2017 Anypay Inc, Steven Zeiler

    Permission to use, copy, modify, and/or distribute this software for any
    purpose  with  or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE  SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
    WITH  REGARD  TO  THIS  SOFTWARE  INCLUDING  ALL  IMPLIED  WARRANTIES  OF
    MERCHANTABILITY  AND  FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
    ANY  SPECIAL ,  DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
    WHATSOEVER  RESULTING  FROM  LOSS  OF USE, DATA OR PROFITS, WHETHER IN AN
    ACTION  OF  CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
    OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/
//==============================================================================

import * as utils from '../utils'

import { expect, spy, account } from '../utils'

import { protocol, schema } from '@/lib/pay/json_v2'

import { log } from '@/lib/log'

//import { ensureInvoice } from '../../lib/invoices'
import { config } from '@/lib'

describe('JSON Payment Protocol V2', () => {

  beforeEach(() => {spy.on(log, 'info') })

  it('#listPaymentOptions should invoice payment options', async () => {

    let invoice = await utils.newInvoice({ account, amount: 5.20 })

    let response = await protocol.listPaymentOptions(invoice)

    let validation = schema.Protocol.PaymentOptions.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#getPaymentRequest returns a payment request', async () => {

    let invoice = await utils.newInvoice({ account, amount: 5.20 })

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    let response = await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let validation = schema.Protocol.PaymentRequest.response.validate(response)

    expect(validation.error).to.be.equal(undefined)

  })

  it('#getPaymentRequest should reject for unsupported currency', async () => {

    let invoice = await utils.newInvoice({ account, amount: 5.20 })

    expect(

      protocol.getPaymentRequest(invoice, {
        currency: 'INVALID',
        chain: 'main'
      })

    ).to.be.eventually.rejectedWith('Unsupported Currency or Chain for Payment Option')

  })

  it.skip('#verifyUnsignedPayment records an event in the invoice event log', async () => {

    let invoice = await utils.newInvoice({ account, amount: 5.20 })

    let {paymentOptions} = await protocol.listPaymentOptions(invoice)

    await protocol.getPaymentRequest(invoice, paymentOptions[0])

    let { chain, currency } = paymentOptions[0]

    await protocol.verifyUnsignedPayment(invoice, {

      chain,

      currency,

      transactions: [{ txhex: '' }]

    })

    expect(log.info).to.have.been.called.with('pay.jsonv2.payment-verification')

  })

  if (config.get('run_e2e_payment_tests')) {

    it('#sendSignedPayment should accept and broadcast transaction', async () => {

      let invoice = await utils.newInvoice({ account, amount: 5.20 })

      let {paymentOptions} = await protocol.listPaymentOptions(invoice)

      let { chain, currency } = paymentOptions[0]

      await protocol.getPaymentRequest(invoice, { chain, currency })

    })

    /*

    it('#sendSignedPayment should mark invoice as paid', async () => {

      let invoice = await utils.newInvoice({ account, amount: 5.20 })

      let client = new TestClient(server, `/i/${invoice.uid}`)

      let { paymentOptions } = await client.getPaymentOptions()

      let paymentOption = paymentOptions.filter((option: any) => {
        return option.currency === 'BSV'
      })[0]

      let { chain, currency } = paymentOption

      let payment = ''// await wallet.buildPayment(paymentRequest.instructions[0].outputs)

      await protocol.sendSignedPayment(invoice, {

        chain,

        currency,

        transactions: [{ txhex: payment }]

      })

      invoice = await ensureInvoice(invoice.uid)

      expect(invoice.status).to.be.equal('paid')

    })

    */

    it('#sendSignedPayment records an event in the invoice evenet log', async () => {

      let invoice = await utils.newInvoice({ account, amount: 5.20 })

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

