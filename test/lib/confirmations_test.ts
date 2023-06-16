
import { expect, newInvoice } from '../utils'

import { confirmPayment, confirmPaymentByTxid, revertPayment } from '../../lib/confirmations'

import { recordPayment, Payment } from './../../lib/payments'

import { Invoice } from './../../lib/invoices'

import { findOne } from './../../lib/orm'

import { randomBytes } from 'crypto'

describe("Confirmations", () => {

  describe('#confirmPayment', () => {

    it('should update the payment with confirmation data', async () => {

      let invoice = await newInvoice({ amount: 0.52 })

      let payment: any = await recordPayment(invoice, {
        txid: randomBytes(32).toString('hex'),
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      const txid = payment.get('txid')

      const confirmation_hash = randomBytes(32).toString('hex')

      const confirmation_height = 1000000

      const confirmation_date = new Date()

      payment = await findOne<Payment>(Payment, { where: { txid }})

      await confirmPayment({
        payment,
        confirmation: {
          confirmation_hash,
          confirmation_height,
          confirmation_date
        }
      })

      payment = await findOne<Payment>(Payment, { where: { txid }})

      expect(payment.get('confirmation_hash')).to.be.equal(confirmation_hash)

      expect(payment.get('confirmation_height')).to.be.equal(confirmation_height)

      expect(payment.get('confirmation_date').toString()).to.be.equal(confirmation_date.toString())

    })

  })

  describe('#confirmPaymentByTxid', () => {

    it('should update the invoice and payment accordingly', async () => {

      let invoice = await newInvoice({ amount: 0.52 })

      const txid = randomBytes(32).toString('hex')

      let payment = await recordPayment(invoice, {
        txid,
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      await invoice.set('hash', txid)

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
  
      payment = await findOne<Payment>(Payment, {
        where: {
          txid
        }
      })

      expect(payment.get('confirmation_hash')).to.be.equal(confirmation_hash)

      expect(payment.get('confirmation_height')).to.be.equal(confirmation_height)

      expect(payment.get('confirmation_date').toString()).to.be.equal(confirmation_date.toString())

    })

  })

  describe('When EVM Reverts a Transaction', () => {

    it('#revertPayment should mark payment as failed and invoice as unpaid', async () => {

      let invoice = await newInvoice({ amount: 0.52 })

      const txid = randomBytes(32).toString('hex')

      const uid = invoice.get('uid')

      let payment = await recordPayment(invoice, {
        txid,
        currency: 'BSV',
        txhex: randomBytes(128).toString('hex')
      })

      await invoice.set('status', 'paid')

      await invoice.set('hash', txid)

      await revertPayment({ txid: payment.txid })

      invoice = await findOne<Invoice>(Invoice, {
        where: {
          uid
        }
      })

      payment = await findOne<Payment>(Payment, {
        where: {
          txid: payment.txid
        }
      })

      expect(invoice.get('status')).to.be.equal('unpaid')

      expect(invoice.get('hash')).to.be.equal(null)

      expect(payment.get('status')).to.be.equal('failed')

    })

  })

  describe("Confirming EVM Payments with Web3 Receipt", () => {

    it("should revertPayment when the payment is reverted by the EVM", async () => {

    })

    it("should confirmPayment when the payment arrives in a block", async () => {

    })

  })

})

