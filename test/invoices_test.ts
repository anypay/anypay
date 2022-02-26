
import * as utils from './utils'

import { expect } from './utils'

import { Account } from '../lib/account'

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

    let account = new Account(await utils.generateAccount())

    var webhook_url = "https://anypay.sv/api/test/webhooks"

    let invoice = await createInvoice({
      account,
      amount: 10,
      webhook_url
    })

    invoice = await ensureInvoice(invoice.uid)

    expect(invoice.webhook_url).to.be.equal(webhook_url)

  })

})
