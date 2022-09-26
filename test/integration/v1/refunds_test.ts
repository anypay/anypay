
import { auth, expect, account, payInvoice, newInvoice, newAccountWithInvoice } from '../../utils'

import { log } from '../../../lib/log'

describe("API V1 Refunds", async () => {

  it("GET /v1/api/account/invoices/{invoice_uid}/refund should return an invoice's refund", async () => {

    const invoice = await newInvoice()

    await payInvoice(invoice)

    let response = await auth(account)({
      method: 'GET',
      url: `/v1/api/account/invoices/${invoice.uid}/refund?address=1ATRLUMNZtWqpeoidWNtV1CDfrFLX51fkR`
    })

    console.log(response)

    expect(response.statusCode).to.be.equal(200)

    expect(response.result.refund).to.be.an('object')
    
  })

  it("should prevent fetching refunds for invoices that belong to another account", async () => {

    const [otherAccount, invoice] = await newAccountWithInvoice()

    log.debug('test.account.other.created', otherAccount)

    await payInvoice(invoice)

    let response = await auth(account)({
      method: 'GET',
      url: `/v1/api/account/invoices/${invoice.uid}/refund?address=1ATRLUMNZtWqpeoidWNtV1CDfrFLX51fkR`
    })

    expect(response.statusCode).to.be.equal(401)
    
  })

})
