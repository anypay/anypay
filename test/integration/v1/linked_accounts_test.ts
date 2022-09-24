
import { auth, expect, account, generateAccount } from '../../utils'

describe("API V1 Linked Accounts", async () => {

  it("GET /v1/api/linked-accounts should list linked accounts", async () => {

    let response = await auth(account)({
      method: 'GET',
      url: '/v1/api/linked-accounts'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("POST /v1/api/linked-accounts link two accounts", async () => {

    const targetAccount = await generateAccount()

    let response = await auth(account)({
      method: 'POST',
      url: '/v1/api/linked-accounts',
      payload: {
        email: targetAccount.email
      }
    })

    expect(response.statusCode).to.be.equal(201)
    
  })


  it("DELETE /v1/api/linked-accounts/{id} should un-link two accounts", async () => {

    const targetAccount = await generateAccount()

    await auth(account)({
      method: 'POST',
      url: '/v1/api/linked-accounts',
      payload: {
        email: targetAccount.email
      }
    })

    let { result } = await auth(account)({
        method: 'GET',
        url: '/v1/api/linked-accounts'
    })

    const { linked_accounts } = result

    const { source } = linked_accounts

    const { id } = source[0]
 
    let response = await auth(account)({
      method: 'DELETE',
      url: `/v1/api/linked-accounts/${id}`
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


})
