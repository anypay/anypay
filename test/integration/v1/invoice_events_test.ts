import { auth, expect, account, newAccountWithInvoice, log } from '../../utils'

describe("Invoice Events", async () => {

  it("GET /v1/api/invoices/{invoice_uid}/events should list events for invoice", async () => {

    const [newAccount, invoice] = await newAccountWithInvoice()

    let response = await auth(newAccount)({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}/events`,
    })

    console.log(response)

    expect(response.statusCode).to.be.equal(200)

    expect(response.result.events).to.be.an('array')
    
  })


  it("should reject when requesting events for unauthorized invoice", async () => {

    const [another, invoice] = await newAccountWithInvoice()

    log.debug('test.account.another.created', another)

    let response = await auth(account)({
      method: 'GET',
      url: `/v1/api/invoices/${invoice.uid}/events`,
    })

    console.log(response)

    expect(response.statusCode).to.be.equal(401)
    
  })


})