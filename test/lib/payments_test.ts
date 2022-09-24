
import { expect, account, newInvoice } from '../utils'

import { recordPayment, getPayment, MultiplePaymentsError, listPayments, PaymenOptionNotFoundError, Payment } from './../../lib/payments'

import { tx } from '..//utils'

describe('Payments', () => {

  it('should have exactly one invoice always', async () => {

    let invoice = await newInvoice({ amount: 0.52 })

    let payment = await recordPayment(invoice, {
      txid: tx.tx_id,
      currency: tx.currency,
      txhex: tx.tx_hex
    })

    expect(payment.invoice).to.be.equal(invoice)

    let invoicePayment = await getPayment(invoice)

    expect(payment.get('id')).to.be.equal(invoicePayment.get('id'))

    expect(payment.outputs).to.be.an('array')

    expect(payment.currency).to.be.equal('BSV')

    expect(payment.txid).to.be.equal(tx.tx_id)

    expect(payment.toJSON()).to.be.an('object')

  })

  it('#getPayment should get the payment for an invoice', async () => {

    let invoice = await newInvoice({ amount: 0.52 })

    await recordPayment(invoice, {
      txid: tx.tx_id,
      currency: tx.currency,
      txhex: tx.tx_hex
    })

    const payment = await getPayment(invoice)

    expect(payment.txid).to.be.equal(tx.tx_id)

  })

  it('should prevent multiple payments for a single invoice', async () => {

    let invoice = await newInvoice({ amount: 0.52 })

    let payment: Payment = await recordPayment(invoice, {
      txid: tx.tx_id,
      currency: tx.currency,
      txhex: tx.tx_hex,
      txjson: { some: 'json' }
    })

    expect(payment.invoice).to.be.equal(invoice);

    expect(

      recordPayment(invoice, {
        txid: tx.tx_id,
        currency: tx.currency,
        txhex: tx.tx_hex,
        txjson: { some: 'json' }
      })

    )
    .to.be.eventually.rejectedWith(MultiplePaymentsError)

  })

  it('#listPayments should return an array of payments for the account', async () => {

    const payments = await listPayments(account)

    expect(payments).to.be.an('array')

  })

  it("should reject payments for an unavailable currency option", async () => {

    let invoice = await newInvoice({ amount: 0.52 })

    expect(

      recordPayment(invoice, {
        txid: tx.tx_id,
        currency: 'INVALID',
        txhex: tx.tx_hex
      })

    )
    .to.be.eventually.rejectedWith(PaymenOptionNotFoundError)
  })


})

