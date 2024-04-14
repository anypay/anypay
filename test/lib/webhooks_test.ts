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

import { attemptWebhook, findWebhook, listForAccount, webhookForInvoice } from '../../lib/webhooks'

describe('lib/webhooks', () => {

  it('#webhookForInvoice should return the webhook for an invoice', async () => {

    try {

    const invoice = await newInvoice({ account })

    const webhook = await webhookForInvoice(invoice)

    expect(webhook).to.be.not.equal(null)


    } catch(error) {

      throw error
    }

  })

  it('#findWebhook should return the webhook by invoice_uid', async () => {

    const invoice = await newInvoice({ account })

    const webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook).to.be.not.equal(null)

  })

  it('#listForAccount should return a list of webhooks', async () => {

    const webhooks = await listForAccount(account)

    expect(webhooks).to.be.an('array')
  })


  it('#attemptWebhook should attempt to send a webhook', async () => {

    const invoice = await newInvoice({ account })

    const webhook = await findWebhook({ invoice_uid: invoice.uid })

    await attemptWebhook(webhook)

  })

  describe("Webhooks for Confirming / Confirmed State", () => {

    it('should send the invoice uid, uri, and status', () => {



    })

    it('should prevent sending a webhook twice if it is already sent', () => {


    })

    it('should specify the type of webhook in the database', () => {
    })

    it('paid webhooks should have type=paid', () => {
      

    })
  })

})
