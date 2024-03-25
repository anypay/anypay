
import { expect, generateAccount, newInvoice } from '../utils'

import { confirmPayment, confirmPaymentByTxid, revertPayment } from '../../lib/confirmations'

import { recordPayment } from './../../lib/payments'

import { randomBytes } from 'crypto'

import prisma from '../../lib/prisma'

describe("Confirmations", () => {

  describe('#confirmPayment', () => {

    it('should update the payment with confirmation data', async () => {

      const account = await generateAccount()

      let invoice = await newInvoice({ amount: 0.52, account })

      let payment: any = await recordPayment(invoice, {
        txid: randomBytes(32).toString('hex'),
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      const txid = payment.get('txid')

      const confirmation_hash = randomBytes(32).toString('hex')

      const confirmation_height = 1000000

      const confirmation_date = new Date()

      payment = await prisma.payments.findFirstOrThrow({
        where: {
          txid
        }
      })

      await confirmPayment({
        payment,
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

      expect(payment.get('confirmation_hash')).to.be.equal(confirmation_hash)

      expect(payment.get('confirmation_height')).to.be.equal(confirmation_height)

      expect(payment.get('confirmation_date').toString()).to.be.equal(confirmation_date.toString())

      expect(payment.get('status')).to.be.equal('confirmed')

    })

  })

  describe('#confirmPaymentByTxid', () => {

    it('should update the invoice and payment accordingly', async () => {

      const account = await generateAccount()

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

      const account = await generateAccount()

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

