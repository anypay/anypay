
require('dotenv').config()

import { email } from 'rabbi'

import { assert, expect, spy } from './utils'

import * as utils from './utils'

import * as http from 'superagent'

import * as get402 from 'get402'

import { createInvoice, InvalidWebhookURL } from '../lib/invoices'

import { setAddress } from '../lib/addresses'

import { Account } from '../lib/account'
import { Invoice } from '../lib/invoices'

import {

  findWebhook, Webhook, attemptWebhook, WebhookAlreadySent,
  PaidWebhook, getPaidWebhookForInvoice

} from '../lib/webhooks'

import { createClient, loadClientForAccount } from '../lib/get_402'

describe('Getting Prices', () => {

  var account;

  beforeEach(() => spy.restore())

  before(async () => {

    account = await utils.createAccount()

    let { address } = await utils.generateKeypair()

    await setAddress(account, {
      currency: 'BSV',
      value: address
    })

  })

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

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.url).to.be.equal(webhook_url)

    expect(webhook.success).to.be.equal(false)

    expect(webhook.attempts.length).to.be.equal(0)

  })

  it('should attempt a webhook', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    spy.on(http, ['get', 'post'])

    spy.on(webhook, ['invoiceToJSON'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.invoiceToJSON).to.have.been.called()

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.attempts[0].response_code).to.be.equal(200)

    expect(webhook.status).to.be.equal('success')

  })

  it('should fair a webhook when server not responding', async () => {

    var webhook_url = "https://anypay.sv/api/invalid"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    spy.on(http, ['get', 'post'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.attempts[0].response_code).to.be.equal(405)

    expect(webhook.status).to.be.equal('failed')

  })

  it('should preventing a webhook attempt given prior success', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    await attemptWebhook(webhook)

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.status).to.be.equal('success')

    expect(webhook.success).to.be.equal(true)

    expect(

      attemptWebhook(webhook)
    
    ).to.be.eventually.rejectedWith(WebhookAlreadySent)

  })

  it('webhook retry schedule should default to no_retry', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice: Invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.retry_policy).to.be.equal('no_retry')

  })

  it('should allow webhook_url to be set on account', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let account = await utils.createAccount()

    await account.set('webhook_url', webhook_url)

    let invoice: Invoice = await createInvoice({
      account,
      amount: 10
      // no webhook_url specified here, default to account webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.url).to.be.equal(webhook_url)

  })

  it('should attempt a webhook', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    spy.on(http, ['get', 'post'])

    spy.on(webhook, ['invoiceToJSON'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.invoiceToJSON).to.have.been.called()

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.attempts[0].response_code).to.be.equal(200)

    expect(webhook.status).to.be.equal('success')

  })

  it('should fair a webhook when server not responding', async () => {

    var webhook_url = "https://anypay.sv/api/invalid"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    spy.on(http, ['get', 'post'])

    await attemptWebhook(webhook)

    expect(http.post).to.have.been.called()

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.attempts[0].response_code).to.be.equal(405)

    expect(webhook.status).to.be.equal('failed')

  })

  it('should preventing a webhook attempt given prior success', async () => {

    var webhook_url = "https://reqbin.com/echo/post/json"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

    expect(webhook.attempts.length).to.be.equal(0)

    await attemptWebhook(webhook)

    expect(webhook.attempts.length).to.be.equal(1)

    expect(webhook.status).to.be.equal('success')

    expect(webhook.success).to.be.equal(true)

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

  describe('Paid Webhooks', () => {

    it("should be allowed with a key that has a positive balance", async () => {

      var webhook_url = "https://reqbin.com/echo/post/json"

      let invoice: Invoice = await createInvoice({
        account,
        amount: 10,
        webhook_url
      })

      let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })


      let client: get402.Client = createClient(process.env.GET402_TEST_CLIENT_IDENTIFIER)

      let paidWebhook: PaidWebhook = new PaidWebhook({ webhook, client })

      let startingBalance = await client.getBalance()

      let attempt = await paidWebhook.attemptWebhook()

      let newBalance = await client.getBalance()

      expect(newBalance).to.be.equal(startingBalance - 1)

      expect(attempt.response_code).to.be.equal(200)

      expect(webhook.status).to.be.equal('success')

    })

    it("should by default declined sending webhooks with empty API key", async () => {

      var webhook_url = "https://reqbin.com/echo/post/json"

      let invoice: Invoice = await createInvoice({
        account,
        amount: 10,
        webhook_url
      })

      let webhook: Webhook = await findWebhook({ invoice_uid: invoice.uid })

      let {privateKey, address} = await utils.generateKeypair()

      let client: get402.Client = createClient(address, privateKey)


      let paidWebhook: PaidWebhook = new PaidWebhook({ webhook, client })

      return expect(

        paidWebhook.attemptWebhook()

      ).to.be.eventually.rejectedWith('Payment Required To Access This Resource')
    })

  })

  describe('Triggering Webhook Upon Payment', () => {

    it("should automatically load the correct get402 api client if one doesn't exist", async() => {

      let account = await utils.createAccount()

      let client = await loadClientForAccount(account)

      assert(client.privatekey)

    })

    it("should not include the private key subsequent times", async() => {

      let account = new Account(await utils.generateAccount())

      let client = await loadClientForAccount(account)

      client = await loadClientForAccount(account)

      assert(!client.privateKey)

    })

    it("should attempt webhook if client key already exists", async() => {

      const account = new Account(await utils.generateAccount())

      var webhook_url = "https://anypay.sv/api/test/webhooks"

      let invoice = await createInvoice({
        account,
        amount: 10,
        webhook_url
      })

      await loadClientForAccount(account)

      let webhook = await getPaidWebhookForInvoice(invoice)

      assert(webhook)

    })

    it("should not attempt webhook if no get402 client key", async() => {
      const account = new Account(await utils.generateAccount())

      var webhook_url = "https://anypay.sv/api/test/webhooks"

      let invoice = await createInvoice({
        account,
        amount: 10,
        webhook_url
      })

      let webhook = await getPaidWebhookForInvoice(invoice)

      assert(!webhook)

    })

    it("should send an email when getting an InsufficientFunds error", async() => {

      const account = new Account(await utils.generateAccount())

      await loadClientForAccount(account)

      var webhook_url = "https://anypay.sv/api/test/webhooks"

      let invoice = await createInvoice({
        account,
        amount: 10,
        webhook_url
      })

      let webhook = await getPaidWebhookForInvoice(invoice)

      spy.on(email, ['sendEmail'])

      try {

        await webhook.attemptWebhook()
       
      } catch(error) {

      }

      expect(email.sendEmail).to.have.been.called.with('get402-insufficient-funds')

    })

  })

})
