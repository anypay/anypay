import { v0AuthRequest as auth, expect, account, chance, createAccount } from '../../utils'

describe("API V0 - BittrexApiKeys ", async () => {

  it("POST /bittrex_api_keys should add keys to your account", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/bittrex_api_keys',
      payload: {
        api_key: chance.word(),
        api_secret: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /bittrex_api_keys should return the api keys from your account", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/bittrex_api_keys',
      payload: {
        api_key: chance.word(),
        api_secret: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("GET /bittrex_api_keys should return the api keys from your account", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/bittrex_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("GET /bittrex_api_keys should return empty if you have no bittrex account set up", async () => {

    const newAccount = await createAccount()

    let response = await auth(newAccount, {
      method: 'GET',
      url: '/bittrex_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("GET /bittrex_api_keys should return empty if you have no bittrex account set up", async () => {

    const newAccount = await createAccount()

    let response = await auth(newAccount, {
      method: 'GET',
      url: '/bittrex_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("DELETE /bittrex_api_keys should remove keys from your account", async () => {

    await auth(account, {
      method: 'POST',
      url: '/bittrex_api_keys',
      payload: {
        api_key: chance.word(),
        api_secret: chance.word()
      }
    })

    let response = await auth(account, {
      method: 'DELETE',
      url: '/bittrex_api_keys'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
