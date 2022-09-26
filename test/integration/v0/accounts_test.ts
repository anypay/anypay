
import { v0AuthRequest, expect, server, chance } from '../../utils'

import * as utils from '../../utils'
import { PrivateKey } from 'bsv'

describe("API - v0 - Accounts", async () => {

  it("GET /accounts/{id} should show public details of an account", async () => {

    const [account] = await utils.newAccountWithInvoice()

    await account.setAddress({
      currency: 'BSV',
      address: new PrivateKey().toAddress().toString()
    })

    let response = await server.inject({
      method: 'GET',
      url: `/accounts/${account.id}`
    })

    console.log('__RESULT', response.result)

    expect(response.statusCode).to.be.equal(200)

    expect(response.result.id).to.be.equal(account.id)

  })

  it("GET /accounts/{email} should show public details of an account", async () => {

    let account = await utils.generateAccount()

    let response = await server.inject({
      method: 'GET',
      url: `/accounts/${account.email}`
    })

    expect(response.statusCode).to.be.equal(200)

    expect(response.result.id).to.be.equal(account.id)

  })

  it("GET /account should return the private details of one's account", async () => {

    let account = await utils.generateAccount()

    let response = await v0AuthRequest(account, {
      method: 'GET',
      url: `/account`
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it("PUT /account should update an account", async () => {

    let account = await utils.generateAccount()

    let response = await v0AuthRequest(account, {
      method: 'PUT',
      url: `/account`,
      payload: {
        business_name: 'Astra Lounge'
      }
    })

    expect(response.statusCode).to.be.equal(200)

  })

  it("POST /accounts should register an account", async () => {

    const [email, password] = [chance.email(), chance.word()]

    let response = await server.inject({
      method: 'POST',
      url: `/accounts`,
      payload:{
        email, password
      }
    })

    expect(response.statusCode).to.be.equal(200)

  })

})
