
import { v0AuthRequest as auth, expect, newAccountWithInvoice, generateAccount } from '../../utils'

describe("API V0 - Invoice Notes", async () => {

  it("POST /invoices/{uid}/notes should attach a note to an invoice", async () => {

    const [account, invoice] = await newAccountWithInvoice()

    let response = await auth(account, {
      method: 'POST',
      url: `/invoices/${invoice.uid}/notes`,
      payload: {
        note: 'What a tremendously fun girl and guy!'
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("POST /invoices/{uid}/notes should fail with an invalid invoice uid", async () => {

    const account = await generateAccount()

    let response = await auth(account, {
      method: 'POST',
      url: `/invoices/7777777/notes`,
      payload: {
        note: 'What a tremendously fun girl and guy!'
      }
    })

    expect(response.statusCode).to.be.equal(400)
    
  })


})
