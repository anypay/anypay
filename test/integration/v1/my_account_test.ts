import { auth, expect, account } from '../../utils'

describe("api/v1/my_account", async () => {

  it('should return my account with success', async () => {

    const response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/my-account'
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
