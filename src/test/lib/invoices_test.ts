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

import { account, expect, newInvoice } from '../utils'

import { cancelInvoice, getInvoice } from '@/lib/invoices'
import { createEmptyInvoice, ensureInvoice, isExpired, refreshInvoice } from '@/lib/invoice'
import { createApp } from '@/lib/apps'
import { invoices as Invoice } from '@prisma/client'
import { getPaymentOptions } from '@/lib/invoices'

describe('lib/invoices', () => {

  it('should get the account for an invoice', async () => {

    const invoice = await newInvoice({ account: account })

    expect(invoice.account_id).to.be.a('number')
    expect(invoice.currency).to.be.a('string')
    expect(invoice.status).to.be.equal('unpaid')
    expect(invoice.webhook_url).to.be.a('string')

  })

  it('#cancelInvoice should cancel an invoice', async () => {

    let invoice: Invoice = await newInvoice({ account })

    await cancelInvoice(invoice)

    invoice = await getInvoice(invoice.uid)

    expect(invoice.status).to.be.equal('cancelled')

  })

  it('#ensureInvoice should get an invoice', async () => {

    let invoice = await newInvoice({ account })

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.uid).to.be.a('string')

  })

  it('#ensureInvoice should fail for an invoice invoice', async () => {

    expect (

        ensureInvoice('INVALID')
    )
    .to.be.eventually.rejected

  })

  it('#refreshInvoice should update the invoice options',  async () => {

    let invoice = await newInvoice({
      account
    })

    await refreshInvoice(invoice.uid)

  })

  it('#isExpired should determine whether an invoice is expired', async () => {

    let invoice = await newInvoice({ account })

    const expired = await isExpired(invoice)

    expect(expired).to.be.false

  })

  it("#createEmptyInvoice should create an invoice for an app", async () => {

    const app = await createApp({ account_id: account.id, name: '@merchant' })

    const invoice = await createEmptyInvoice(app.id, {
        amount: 52.00,
        currency: 'RUB'
    })

    expect(invoice.status).to.be.equal('unpaid')

  })


  it("#createEmptyInvoice should fail with invalid app id", async () => {

    expect (

        createEmptyInvoice(-1, {
          currency: 'USD'
        })

    )
    .to.be.eventually.rejected

  })

  it('#getPaymentOptions should get the options for an invoice', async () => {

    let invoice = await newInvoice({
      account
    })

    let options = await getPaymentOptions(invoice.uid)

    expect(options).to.be.an('array')
    
  })

})
 
