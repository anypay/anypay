import * as utils from '../utils'

import { expect, server } from '../utils'

import { TestClient } from 'anypay-simple-wallet'

import { createInvoice } from '../../lib/invoices'

import { setAddress } from '../../lib/addresses'

describe("XMR End To End Payments", async () => {

  it("should not have payment options without monero address", async () => {

    let {invoice} = await utils.newAccountWithInvoice({ amount: 0.25 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'XMR'
    })[0]

    expect(!paymentOption)

  })

  it("should not have payment options without monero view key", async () => {

    let account = await utils.createAccount()

    await account.setAddress({
      currency: 'XMR',
      address: '463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk'
    })

    let invoice = await createInvoice({ account, amount: 0.25 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'XMR'
    })[0]

    expect(!paymentOption)

  })

  it("should have payment options with address and view key", async () => {

    let account = await utils.createAccount()

    await  setAddress(account, {
      currency: 'XMR',
      value: '463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk',
      view_key: '456c22b9b337307c459d937f107d0e5d86323750475e6375c1dec86000cd5f09'
    })

    let invoice = await createInvoice({ account, amount: 0.25 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'XMR'
    })[0]

    console.log('OPTION', paymentOption)

    expect(paymentOption.currency).to.be.equal('XMR')

  })

  it.skip("should make a live XMR payment with success", async () => {
    /*

    let account = await utils.createAccount()

    await setAddress(account, {
      currency: 'XMR',
      value: '463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk',
      view_key: '456c22b9b337307c459d937f107d0e5d86323750475e6375c1dec86000cd5f09'
    })

    let invoice = await createInvoice({ account, amount: 0.25 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'XMR'
    })[0]

    let paymentRequest = await client.selectPaymentOption(paymentOption)

    let payment = await wallet.buildPayment(paymentRequest.instructions[0].outputs)

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment'
      },
      payload: {
        transactions: [{ tx: payment }],
        chain: 'XMR',
        currency: 'XMR'
      }
    })

    expect(response.statusCode).to.be.equal(200)

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.get('status')).to.be.equal('paid')
    */

  })

  it("should fail a live XMR payment with bad tx hex", async () => {

    let account = await utils.createAccount()

    await setAddress(account, {
      currency: 'XMR',
      value: '463jsVqBMm36nf4EM8QEZnPBSFVAoNP1ydfJGbkePR5q53CU3UDjGBGfHDDT2dNowZh1PeqYZbFvjMr1hac2kpaoKGcF2fk',
      view_key: '456c22b9b337307c459d937f107d0e5d86323750475e6375c1dec86000cd5f09'
    })

    let invoice = await createInvoice({ account, amount: 0.25 })

    let client = new TestClient(server, `/i/${invoice.uid}`)

    let { paymentOptions } = await client.getPaymentOptions()

    let paymentOption = paymentOptions.filter(option => {
      return option.currency === 'XMR'
    })[0]

    await client.selectPaymentOption(paymentOption)

    let payment = '12345'

    let response = await server.inject({
      method: 'POST',
      url: `/i/${invoice.uid}`,
      headers: {
        'x-paypro-version': 2,
        'Content-Type': 'application/payment'
      },
      payload: {
        transactions: [{ tx: payment }],
        chain: 'XMR',
        currency: 'XMR'
      }
    })

    expect(response.statusCode).to.be.equal(400)

  })

})

