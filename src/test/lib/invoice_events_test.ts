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

import { expect, server, log } from '../utils'

import { listInvoiceEvents } from '@/lib/events'

import { createInvoice } from '@/lib/invoices'

//@ts-ignore
import { TestClient } from 'payment-protocol'

import { bsv } from 'scrypt-ts'

const {Transaction} = bsv

import delay from 'delay'

describe('Invoice Events', () => {

  it('each event should have a list of events associated', async () => {

    const account = await utils.generateAccount()

    let invoice = await createInvoice({
      account,
      amount: 10
    })

    let events = await listInvoiceEvents(invoice)

    expect(events).to.be.an('array')

  })

  it.skip('should have a created event by default upon creation', async () => {

    const account = await utils.generateAccount()

    let invoice = await createInvoice({
      account,
      amount: 10
    })


    let events = await listInvoiceEvents(invoice, 'invoice.created')

    const [event] = events

    expect(event.invoice_uid).to.be.equal(invoice.uid)

    expect(event.type).to.be.equal('invoice.created')

  })

  it.skip('should have a paid event once paid', async () => {

    const account = await utils.generateAccount()

    let invoice = await createInvoice({
      account,
      amount: 10
    })

    let [event] = await listInvoiceEvents(invoice, 'invoice.paid')

    expect(event.invoice_uid).to.be.equal(invoice.uid)

    // pay invoice

    expect(event.type).to.be.equal('invoice.paid')

  })

  describe("Payment Protocol Events", () => {

    it('has an event for every payment verification request', async () => {

      const account = await utils.generateAccount()

      const invoice = await utils.newInvoice({ account, amount: 5.25 })

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-verification')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      let { paymentOptions } = await client.getPaymentOptions()

      await client.selectPaymentOption(paymentOptions[0])

      const tx = new Transaction().serialize()

      try {

        await client.verifyPayment({
          chain: 'BSV',
          currency: 'BSV',
          transactions: [{ tx }]
        })

      } catch(error) {

        log.debug('client.verifyPayment.error', error)

      }
      
      events = await listInvoiceEvents(invoice)

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment-verification')

      //expect(events[0].get('wallet')).to.be.equal('edge')
 
      expect(events.length).to.be.equal(1)

    })

    it.skip('has an event for submission of transaction to network', async () => {

      const account = await utils.generateAccount()

      const invoice = await utils.newInvoice({ account, amount: 5.25 })

      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.broadcast')

      expect(events.length).to.be.equal(0)

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      const tx = new Transaction().serialize()

      try {

        await client.sendPayment({
          chain: 'BSV',
          currency: 'BSV',
          transactions: [{ tx }]
        })

      } catch(error) {

        log.debug('client.sendPayment.error', error)

      }

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.broadcast')
 
      expect(events.length).to.be.equal(0)

      events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.unsigned.verify.error')

      //expect(events[0].wallet).to.be.equal('edge')

    })

    it.skip('has an event for response from failed transaction broadcast ', async () => {

      const account = await utils.generateAccount()

      let invoice = await createInvoice({ 
        account,
        amount: 0.10
      })

      let client = new TestClient(server, `/i/${invoice.uid}`, {
        headers: {
          'x-requested-with': 'co.edgesecure.app'
        }
      })

      const tx = new Transaction().serialize()

      await client.sendPayment({
        chain: 'BSV',
        currency: 'BSV',
        transactions: [{ tx }]
      })

      // Simulate failure by the blockchain p2p provider
 
      let events = await listInvoiceEvents(invoice, 'pay.jsonv2.payment.error')

      await delay(5000)
 
      expect(events.length).to.be.equal(1)

      //expect(events[0].get('wallet')).to.be.equal('edge')

    })

  })

})

