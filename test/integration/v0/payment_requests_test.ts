
import { expect, account, authHeaders, server } from '../../utils'

import { createApp, createAppToken } from '../../../lib/apps'

describe("API V0", async () => {

  it("POST /r should create a payment request", async () => {

    const app = await createApp({
      account_id: account.id, name: "@test"
    })

    const token = await createAppToken(app)

    const headers = authHeaders(token.uid, '')

    let response = await server.inject({
      method: 'POST',
      url: '/r',
      headers,
      payload: {
        template: [{
          currency: 'BSV',
          to: {
            amount: 52,
            currency: 'USD',
            address: '1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C'
          }
        }],
        options: {
          
        }
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("POST /payment-requests should create a payment request", async () => {

    const app = await createApp({
      account_id: account.id, name: "@test"
    })

    const token = await createAppToken(app)

    const headers = authHeaders(token.uid, '')

    let response = await server.inject({
      method: 'POST',
      url: '/payment-requests',
      headers,
      payload: {
        template: [{
          currency: 'BSV',
          to: {
            amount: 52,
            currency: 'USD',
            address: '1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C'
          }
        }],
        options: {
          
        }
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

  it("DELETE /r/{uid} should cancel a payment request", async () => {

    const app = await createApp({
      account_id: account.id, name: "@test"
    })

    const token = await createAppToken(app)

    const headers = authHeaders(token.uid, '')

    let { result } = await server.inject({
      method: 'POST',
      url: '/r',
      headers,
      payload: {
        template: [{
          currency: 'BSV',
          to: {
            amount: 52,
            currency: 'USD',
            address: '1FdmEDQHL4p4nyE83Loyz8dJcm7edagn8C'
          }
        }]
      }
    })

    let response = await server.inject({
      method: 'DELETE',
      url: `/r/${result.uid}`,
      headers
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
