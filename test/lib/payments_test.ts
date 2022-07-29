
import * as utils from '../utils'

import { expect } from '../utils'

import { recordPayment, getPayment } from './../../lib/payments'

describe('Payments', () => {

  it('should have exactly one invoice always', async () => {

    let result = await utils.newAccountWithInvoice()

    let invoice = result[1]

    let payment = await recordPayment(invoice, {
      txid: '12345',
      currency: 'BSV',
      txhex: '11111111111'
    })

    expect(payment.invoice).to.be.equal(invoice)

    let invoicePayment = await getPayment(invoice)

    expect(payment.get('id')).to.be.equal(invoicePayment.get('id'))
    expect(payment.outputs).to.be.an('array')

  })

  it('should prevent multiple payments for a single invoice', async () => {

    let result = await utils.newAccountWithInvoice()

    let invoice = result[1]

    let payment = await recordPayment(invoice, {
      txid: '12345',
      currency: 'BSV',
      txhex: '11111111111',
      txjson: { some: 'json' }
    })

    expect(payment.invoice).to.be.equal(invoice);

    try {

      recordPayment(invoice, {
        txid: '3939399',
        currency: 'BSV',
        txhex: '2222222',
        txjson: { some: 'json' }
      })

      throw new Error()

    } catch(error){ 

      expect(error).to.be.a('error')

    }

  })

  it('is created upon successful receipt of payment')
  it('contains txid,currency,outputs,createdAt')

})

