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

import { expect, account } from '../utils'

import { recordPayment, getPayment } from './../../lib/payments'

describe('Payments', () => {

  it('should have exactly one invoice always', async () => {

    let invoice = await utils.newInvoice({ amount: 0.52, account })

    let payment = await recordPayment(invoice, {
      txid: '12345',
      currency: 'BSV',
      txhex: '11111111111'
    })

    expect(payment.invoice_uid).to.be.equal(invoice.uid)

    let invoicePayment = await getPayment(invoice)

    expect(payment.id).to.be.equal(invoicePayment?.id)

  })

  it('should prevent multiple payments for a single invoice', async () => {

    let invoice = await utils.newInvoice({ account, amount: 0.52 })

    let payment = await recordPayment(invoice, {
      txid: '12345',
      currency: 'BSV',
      txhex: '11111111111',
      txjson: { some: 'json' }
    })

    expect(payment.invoice_uid).to.be.equal(invoice.uid);

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

