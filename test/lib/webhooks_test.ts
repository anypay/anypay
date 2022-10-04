
import { expect, newInvoice, account } from '../utils'

import { attemptWebhook, findWebhook, listForAccount, webhookForInvoice } from '../../lib/webhooks'

describe('lib/webhooks', () => {

  it('#webhookForInvoice should return the webhook for an invoice', async () => {

    try {

    const invoice = await newInvoice()

    console.log('new invoice', invoice)

    const webhook = await webhookForInvoice(invoice)

    console.log('webhook', webhook)


    expect(webhook).to.be.not.equal(null)


    } catch(error) {

      console.error('NIV_', error)

      throw error
    }

  })

  it('#findWebhook should return the webhook by invoice_uid', async () => {

    const invoice = await newInvoice()

    const webhook = await findWebhook({ invoice_uid: invoice.uid })

    console.log('__webhook__', webhook)

    expect(webhook).to.be.not.equal(null)

  })

  it('#listForAccount should return a list of webhooks', async () => {

    const webhooks = await listForAccount(account)

    expect(webhooks).to.be.an('array')
  })


  it('#attemptWebhook should attempt to send a webhook', async () => {

    const invoice = await newInvoice()

    const webhook = await findWebhook({ invoice_uid: invoice.uid })

    await attemptWebhook(webhook)

  })

})