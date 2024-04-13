
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
