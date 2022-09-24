
import { auth, expect, account, tx } from '../../utils'

describe("Setting Your Woocommerce Image", async () => {

  it("GET /v1/woocommerce/checkout_images should list all available images", async () => {

    let response = await auth(account)({
      method: 'POST',
      url: '/v1/api/transactions',
      payload: {
        chain: 'BSV',
        transaction: tx.tx_hex
      }
    })

    expect(response.statusCode).to.be.equal(200)
    
  })

})
