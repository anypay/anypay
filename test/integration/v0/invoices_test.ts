import { v0AuthRequest as auth, expect, newAccountWithInvoice } from '../../utils'

describe("API V0 - Invoice Payment Options", async () => {

  it("GET /invoices/{invoice_uid}/payment_options should return the payment options", async () => {

    const [newAccount] = await newAccountWithInvoice()

    let response = await auth(newAccount, {
      method: 'GET',
      url: '/invoices'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("POST /invoices", async () => {

    const [newAccount] = await newAccountWithInvoice()

    let response = await auth(newAccount, {
      method: 'POST',
      url: '/invoices',
      payload: {
        amount: 52.00
      }
    })

    console.log('__POSTED INVOICES', response)

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("DELETE /invoices/{uid}", async () => {

    const [newAccount, invoice] = await newAccountWithInvoice()

    let response = await auth(newAccount, {
      method: 'DELETE',
      url: `/invoices/${invoice.uid}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("DELETE /invoices/{uid} should fail with an invalid invoice uid", async () => {

    const [newAccount] = await newAccountWithInvoice()

    let response = await auth(newAccount, {
      method: 'DELETE',
      url: `/invoices/77777777`
    })

    expect(response.statusCode).to.be.equal(404)
    
  })

  it("GET /invoices/{invoice_uid}", async () => {

    const [newAccount, invoice] = await newAccountWithInvoice()

    let response = await auth(newAccount, {
      method: 'GET',
      url: `/invoices/${invoice.uid}/payment_options`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
