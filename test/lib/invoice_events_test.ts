
import { listInvoiceEvents } from '../../lib/events'

import { createInvoice } from '../../lib/invoices'

import { TestClient } from 'payment-protocol'

import * as utils from '../utils'

import { expect, server } from '../utils'

describe('Invoice Events', () => {

  var invoice;

  before(async () => {

    var {invoice: i} = await utils.newAccountWithInvoice();

    invoice = i;

  })

  it('each event should have a list of events associated', async () => {

    let events = await listInvoiceEvents(invoice)

    expect(events).to.be.an('array')

  })

  it('should have a created event by default upon creation', async () => {

    let events = await listInvoiceEvents(invoice, 'invoice.created')

    const [event] = events

    expect(event.get('invoice_uid')).to.be.equal(invoice.uid)

    expect(event.get('type')).to.be.equal('invoice.created')

  })

  it.skip('should have a paid event once paid', async () => {

    let [event] = await listInvoiceEvents(invoice, 'invoice.paid')

    expect(event.get('invoice_uid')).to.be.equal(invoice.uid)

    // pay invoice

    expect(event.get('type')).to.be.equal('invoice.paid')

  })

  describe("Payment Protocol Events", () => {

    var account, invoice;

    before(async () => {

      let {account: a, invoice: i} = await utils.newAccountWithInvoice()

      account = a; invoice = i;

    })

    it('has an event for every time the payment options are requested', async () => {

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-options')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      await client.getPaymentOptions()

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-options')

      expect(events[0].get('wallet')).to.be.equal('edge')

      expect(events.length).to.be.equal(1)

    })


    it('has an event for every time a specific payment option is requested', async () => {

      let invoice = await createInvoice({ 
        account,
        amount: 0.10
      })

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-request')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      let { paymentOptions } = await client.getPaymentOptions()

      await client.selectPaymentOption(paymentOptions[0])
 
      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-request')
 
      expect(events.length).to.be.equal(1)

      expect(events[0].get('wallet')).to.be.equal('edge')

    })

    it('has an event for every payment verification request', async () => {

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-verification')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      let { paymentOptions } = await client.getPaymentOptions()

      await client.selectPaymentOption(paymentOptions[0])
 
      await await client.verifyPayment({
        chain: "BSV",
        currency: "BSV",
        transactions: [{
          tx: 'someinvalidnhexbahaha'
        }]
      })

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-verification')

      expect(events[0].get('wallet')).to.be.equal('edge')
 
      expect(events.length).to.be.equal(1)

    })

    it('has an event for every payment transmitted to Anypay', async () => {

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment')

      expect(events.length).to.be.equal(0)

      // Submit unsigned transaction for validation
      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      let { paymentOptions } = await client.getPaymentOptions()

      await client.selectPaymentOption(paymentOptions[0])
 
      await client.sendPayment({
        chain: "BSV",
        currency: "BSV",
        transactions: [{
          tx: 'someinvalidnhexbahaha'
        }]
      })

 
      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment')

      expect(events[0].get('wallet')).to.be.equal('edge')
 
      expect(events.length).to.be.equal(1)

    })

    it.skip('has an event for submission of transaction to network', async () => {

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.broadcast')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      await client.sendPayment({
        chain: 'BSV',
        currency: 'BSV',
        transactions: [{ tx: 'invaliderp' }]
      })

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.broadcast')
 
      expect(events.length).to.be.equal(1)
      expect(events[0].get('wallet')).to.be.equal('edge')

    })

    it('has an event for response from failed transaction broadcast ', async () => {

      let invoice = await createInvoice({ 
        account,
        amount: 0.10
      })

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      await client.sendPayment({
        chain: 'BSV',
        currency: 'BSV',
        transactions: [{ tx: 'invaliderp' }]
      })

      // Simulate failure by the blockchain p2p provider
 
      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.error')
 
      expect(events.length).to.be.equal(1)

      expect(events[0].get('wallet')).to.be.equal('edge')

    })

  })

})

