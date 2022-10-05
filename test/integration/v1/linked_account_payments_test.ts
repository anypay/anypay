import { auth, expect, account, generateAccount } from '../../utils'

describe("Linked Account Payments", async () => {

    it("GET /v1/api/linked-accounts/{account_id}/payments list payments of linked account", async () => {

        const targetAccount = await generateAccount()

        await auth(account)({
          method: 'POST',
          url: '/v1/api/linked-accounts',
          payload: {
            email: targetAccount.email
          }
        })
     
        let response = await auth(targetAccount)({
          method: 'GET',
          url: `/v1/api/linked-accounts/${account.id}/payments`
        })
    
        expect(response.statusCode).to.be.equal(200)
        
      })


    it("should return unauthorized for missing link", async () => {

        const targetAccount = await generateAccount()

        await auth(account)({
          method: 'POST',
          url: '/v1/api/linked-accounts',
          payload: {
            email: targetAccount.email
          }
        })
     
        let response = await auth(targetAccount)({
          method: 'GET',
          url: `/v1/api/linked-accounts/7777777/payments`
        })
    
        expect(response.statusCode).to.be.equal(401)
        
      })
    
    
})
