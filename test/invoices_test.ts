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

import * as utils from './utils'

import { expect } from './utils'

import { InvoiceNotFound, ensureInvoice, createInvoice } from '../lib/invoices'

describe("Generating Invoices", () => {

  it("should require an account and amount at minimum")

  it("#ensureInvoice should throw if the invoice doesn't exist",async () => {

    let uid = ''    

    expect(

      ensureInvoice(uid)

    ).to.be.eventually.rejectedWith(InvoiceNotFound)

  })

  it("should ensure an invoice exists and not throw", async () => {

    let account = await utils.createAccount()

    var webhook_url = "https://anypay.sv/api/test/webhooks"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    console.log(invoice, 'createInvoice.result')

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.webhook_url).to.be.equal(webhook_url)

  })

  it('should create payment options for the invoice', async () => {

    let [account] = await utils.createAccountWithAddress()

    let invoice = await createInvoice({
      account,
      amount: 10
    })

    let options = await invoice.getPaymentOptions()

    expect(options.length).to.be.equal(1)

    expect(options[0].get('currency')).to.be.equal("BSV")

  })

  it('should include a default webhook url', async () => {

    let [account] = await utils.createAccountWithAddress()

    let invoice = await createInvoice({
      account,
      amount: 10
    })

    expect(invoice.webhook_url).to.be.equal('https://api.anypayx.com/v1/api/test/webhooks')


  })

})
