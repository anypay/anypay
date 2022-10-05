import { v0AuthRequest as auth, expect, newAccountWithInvoice } from '../../utils'

describe("API V0 - Search", async () => {

  it("GET /v0/search should return an invoice based on a search", async () => {

    const [account, invoice] = await newAccountWithInvoice()

    let response = await auth(account, {
      method: 'POST',
      url: '/v0/search',
      payload: {
        search: invoice.uid
      }
    })

    console.log(response.result)

    expect(response.statusCode).to.be.equal(200)
    
  })

})