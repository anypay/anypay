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

import { expect, newInvoice, account } from '../utils'

import { createInvoice } from '../../lib/invoices'

import { confirmPayment, confirmPaymentByTxid, revertPayment } from '../../lib/confirmations'

import { recordPayment } from './../../lib/payments'

import { randomBytes } from 'crypto'

import prisma from '../../lib/prisma'
import { setAddress } from '../../lib/core'

describe("Confirmations", () => {

  describe('#confirmPayment', () => {

    it.skip('should update the payment with confirmation data', async () => {
      
      await setAddress({
        account_id: account.id,
        chain: 'BSV',
        currency: 'BSV',
        address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
      })

      let invoice = await createInvoice({ amount: 0.52, account })

      /*const payment_options = await prisma.payment_options.findMany({
        where: {
          invoice_uid: invoice.uid
        }
      })*/

      //console.log(payment_options, 'payment_options')


      let payment: any = await recordPayment(invoice, {
        txid: randomBytes(32).toString('hex'),
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      const txid = payment.txid

      const confirmation_hash = randomBytes(32).toString('hex')

      const confirmation_height = 1000000

      const confirmation_date = new Date()

      payment = await prisma.payments.findFirstOrThrow({
        where: {
          id: payment.id
        }
      })

      console.log(payment, '2')

      let result = await confirmPayment({
        payment,
        confirmation: {
          confirmation_hash,
          confirmation_height,
          confirmation_date
        }
      })

      console.log('payment.conformed', result)

      payment = await prisma.payments.findFirstOrThrow({
        where: {
          txid
        }
      })

      expect(payment.confirmation_hash).to.be.equal(confirmation_hash)

      expect(payment.confirmation_height).to.be.equal(confirmation_height)

      expect(payment.confirmation_date.toString()).to.be.equal(confirmation_date.toString())

      expect(payment.status).to.be.equal('confirmed')

    })

  })

  describe('#confirmPaymentByTxid', () => {

    it.skip('should update the invoice and payment accordingly', async () => {

      await setAddress({
        account_id: account.id,
        chain: 'BSV',
        currency: 'BSV',
        address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
      })

      let invoice = await newInvoice({ amount: 0.52, account })

      const txid = randomBytes(32).toString('hex')

      let payment = await recordPayment(invoice, {
        txid,
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      await prisma.invoices.update({
        where: {
          id: invoice.id
        },
        data: {
          hash: txid
        }
      })

      const confirmation_hash = randomBytes(32).toString('hex')

      const confirmation_height = 100000000

      const confirmation_date = new Date()

      await confirmPaymentByTxid({
        txid: payment.txid,
        confirmation: {
          confirmation_hash,
          confirmation_height,
          confirmation_date
        }
      })
  
      payment = await prisma.payments.findFirstOrThrow({
        where: {
          txid
        }
      })

      expect(payment.confirmation_hash).to.be.equal(confirmation_hash)

      expect(payment.confirmation_height).to.be.equal(confirmation_height)

      expect(payment.confirmation_date?.toString()).to.be.equal(confirmation_date.toString())

    })

  })

  describe('When EVM Reverts a Transaction', () => {

    it('#revertPayment should mark payment as failed and invoice as unpaid', async () => {

      await setAddress({
        account_id: account.id,
        chain: 'BSV',
        currency: 'BSV',
        address: '1SbmHpETuDdkLPAaFoY9GqMiHToCwMUNJ'
      })

      let invoice = await newInvoice({ amount: 0.52, account })

      const txid = randomBytes(32).toString('hex')

      const uid = invoice.uid

      let payment = await recordPayment(invoice, {
        txid,
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      await prisma.invoices.update({
        where: {
          id: invoice.id
        },
        data: {
          hash: txid,
          status: 'paid'
        }
      })

      await revertPayment({ txid: payment.txid })

      invoice = await prisma.invoices.findFirstOrThrow({
        where: {
          uid
        }
      })

      payment = await prisma.payments.findFirstOrThrow({
        where: {
          txid: payment.txid
        }
      })

      expect(invoice.status).to.be.equal('unpaid')

      expect(invoice.hash).to.be.equal(null)

      expect(payment.status).to.be.equal('failed')

    })

  })

  describe("Confirming EVM Payments with Web3 Receipt", () => {

    it("should revertPayment when the payment is reverted by the EVM", async () => {

    })

    it("should confirmPayment when the payment arrives in a block", async () => {

    })

  })

})

