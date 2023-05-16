
import { expect, newAccountWithInvoice } from '../utils'

import { log } from '../../lib/log'

import { getRefund, Refund, RefundErrorInvoiceNotPaid } from '../../lib/refunds'

import * as uuid from 'uuid'

import { createHash } from 'crypto'

describe('lib/refunds', () => {

  it('#getRefund should return a Refund for an Invoice given explicit refund address', async () => {

    const [account, invoice] = await newAccountWithInvoice()

    log.debug('test.account.created', account)

    await invoice.set('status', 'paid')

    await invoice.set('invoice_currency', 'DASH')

    await invoice.set('denomination_currency', 'USD')

    await invoice.set('denomination', 'USD')

    await invoice.set('denomination_amount_paid', 52.00)

    const refund: Refund = await getRefund(invoice, 'XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy')

    expect(refund.get('refund_invoice_uid')).to.be.a('string')

    expect(refund.get('status')).to.be.equal('unpaid')

    expect(refund.get('address')).to.be.equal('XxarAzZrvZdZfqWPwCqJCK3Fyd2PMg38wy')

    expect(refund.get('original_invoice_uid')).to.be.equal(invoice.get('uid'))

  })

  it.skip('#getRefund should detect the refund address if not explicitly provided', async () => {

    const txid = createHash('sha256').update(uuid.v4(), 'utf8').digest()

    const [account, invoice] = await newAccountWithInvoice()

    log.debug('test.account.created', account)

    await invoice.update({
      status: 'paid',
      currency: 'BCH',
      invoice_currency: 'BCH',
      denomination_currency: 'USD',
      denomination: 'USD',
      denomination_amount_paid: '52.00',
      hash: txid
    })

    const refund: Refund = await getRefund(invoice) // Omit explicit refund address

    expect(refund.get('refund_invoice_uid')).to.be.a('string')

    expect(refund.get('status')).to.be.equal('unpaid')

    expect(refund.get('address')).to.be.equal('bitcoincash:qrk5wv9yyxhs00xt7qwj8u6xm89mar3ucsv2gxessa')

    expect(refund.get('original_invoice_uid')).to.be.equal(invoice.get('uid'))

  })

  it('#getRefund should reject for an invoice that is not yet paid', async () => {

    const [account, invoice] = await newAccountWithInvoice()

    log.debug('test.account.created', account)

    expect(

      getRefund(invoice)

    )
    .to.be.eventually.rejectedWith(RefundErrorInvoiceNotPaid)

  })

})
 
