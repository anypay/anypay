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

require('dotenv').config()

import { expect, spy, account } from './utils'

import * as utils from './utils'

import * as http from 'superagent'

import { createInvoice, InvalidWebhookURL } from '../lib/invoices'

import {

  findWebhook,attemptWebhook, WebhookAlreadySent,

} from '../lib/webhooks'

import prisma from '../lib/prisma'

describe('Getting Prices', () => {

  beforeEach(() => spy.restore())

  it('should require that a webhook URL is a valid URL', async () => {
    var webhook_url = "notavalidurl"

    expect(

      createInvoice({
        account,
        amount: 10,
        webhook_url
      })

    ).to.be.eventually.rejectedWith(new InvalidWebhookURL(webhook_url))

  })

  it('should accept a valid webhook URL', async () => {

    var webhook_url = "https://anypay.sv/api/test/webhooks"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    expect(invoice.webhook_url).to.be.equal(webhook_url)

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.url).to.be.equal(webhook_url)

  })

  it('should attempt a webhook', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    spy.on(http, ['get', 'post'])

    spy.on(webhook, ['invoiceToJSON'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.status).to.be.equal('success')

  })

  it('should fair a webhook when server not responding', async () => {

    var webhook_url = "https://anypay.sv/api/invalid"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })
    spy.on(http, ['get', 'post'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.status).to.be.equal('failed')

  })

  it('should preventing a webhook attempt given prior success', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    await attemptWebhook(webhook)

    expect(webhook.status).to.be.equal('success')

    expect(

      attemptWebhook(webhook)
    
    ).to.be.eventually.rejectedWith(WebhookAlreadySent)

  })

  it('webhook retry schedule should default to no_retry', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.retry_policy).to.be.equal('no_retry')

  })

  it('should allow webhook_url to be set on account', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let account = await utils.createAccount()

    await prisma.accounts.update({
      where: {
        id: account.id
      },
      data: {
        webhook_url
      }
    })

    let invoice = await createInvoice({
      account,
      amount: 10
      // no webhook_url specified here, default to account webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.url).to.be.equal(webhook_url)

  })

  it('should attempt a webhook', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    spy.on(http, ['get', 'post'])

    spy.on(webhook, ['invoiceToJSON'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.status).to.be.equal('success')

  })

  it('should fair a webhook when server not responding', async () => {

    var webhook_url = "https://anypay.sv/api/invalid"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    spy.on(http, ['get', 'post'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.status).to.be.equal('failed')

  })

  it('should preventing a webhook attempt given prior success', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    await attemptWebhook(webhook)

    expect(webhook.status).to.be.equal('success')

    expect(

      attemptWebhook(webhook)
    
    ).to.be.eventually.rejectedWith(WebhookAlreadySent)

  })

  it('webhook retry schedule should default to no_retry', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

  })
})