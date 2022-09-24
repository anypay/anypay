import { v0AuthRequest as auth, expect, newAccountWithInvoice } from '../../utils'

describe("API V0 - Invoice Payment Options", async () => {

  it("GET /invoices/{invoice_uid}/payment_options should return the payment options", async () => {

    const [account, invoice] = await newAccountWithInvoice()

    let response = await auth(account, {
      method: 'GET',
      url: `/invoices/${invoice.uid}/payment_options`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
