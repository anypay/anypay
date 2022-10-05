
import { v0AuthRequest as auth, expect, account, chance } from '../../utils'

describe("API V0", async () => {

  it("GET /apps should return a list of your apps", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/apps'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("POST /apps should create a new app", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/apps',
      payload: {
        name: chance.word()
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })


  it("GET /apps/{id} should return details of a single app", async () => {

    let response = await auth(account, {
      method: 'POST',
      url: '/apps',
      payload: {
        name: chance.word()
      }
    })


    let { statusCode } = await auth(account, {
      method: 'GET',
      url: `/apps/${response.result.app.id}`
    })

    expect(statusCode).to.be.equal(200)
    
  })

  it("GET /apps/{id} should return empty with invalid app id", async () => {

    let response = await auth(account, {
      method: 'GET',
      url: '/apps/777777'
    })

    console.log('__RESPONSE', response)

    expect(response.statusCode).to.be.equal(404)
    
  })

})
