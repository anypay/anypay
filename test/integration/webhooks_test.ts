import * as utils from '../utils'

import { expect, server } from '../utils'

import { ensureAccessToken } from '../../lib/access_tokens'

import { createInvoice } from '../../lib/invoices'

import { findWebhook, attemptWebhook } from '../../lib/webhooks'

describe("Listing Available Webhooks", async () => {

  it("GET /api/v1/webhooks get your account's webhooks", async () => {

    let account = await utils.generateAccount()

    let response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.statusCode).to.be.equal(200)
    expect(response.result.webhooks.length).to.be.equal(0)

  })

  it("POST /api/v1/webhooks/:invoice_uid should allow retrying failed webhook", async () => {

    let account = await utils.generateAccount()

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url: 'https://anypayx.com/api/invalid'
    })

    let response = await utils.authRequest(account, {
      method: 'POST',
      url: `/api/v1/webhooks/${invoice.uid}/attempts`
    })

    expect(response.statusCode).to.be.equal(201)
    expect(response.result.webhook.invoice_uid).to.be.equal(invoice.uid)
    expect(response.result.webhook.attempts.length).to.be.equal(1)
    expect(response.result.attempt.response_code).to.be.equal(405)

    response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.statusCode).to.be.equal(200)
    expect(response.result.webhooks.length).to.be.equal(1)

  })



  it("should return a list that is not empty", async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let account = await utils.generateAccount()

    var response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.result.webhooks.length).to.be.equal(0)

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.result.webhooks.length).to.be.equal(1)

    expect(response.result.webhooks[0].url).to.be.equal(webhook_url)

    expect(response.result.webhooks[0].status).to.be.equal('pending')

    invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.result.webhooks.length).to.be.equal(2)

  })

  it('should also include the list of attempts', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let account = await utils.generateAccount()

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    var response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.result.webhooks.length).to.be.equal(1)
    expect(response.result.webhooks[0].attempts.length).to.be.equal(0)

    let webhook = await findWebhook({ invoice_uid: invoice.uid })

    await attemptWebhook(webhook)

    var response = await utils.authRequest(account, {
      method: 'GET',
      url: '/api/v1/webhooks'
    })

    expect(response.result.webhooks[0].attempts.length).to.be.equal(1)
    expect(response.result.webhooks[0].status).to.be.equal('success')
    expect(response.result.webhooks[0].attempts[0].response_code).to.be.equal(200)

  })

})

