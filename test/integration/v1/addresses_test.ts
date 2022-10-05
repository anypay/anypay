import { auth, expect, account } from '../../utils'

describe("Setting Addresses Via REST", async () => {

  it('V1', async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    var response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses',
      payload: {
        address: address
      }
    })

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        address: address,
        currency: "BTC"
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses'
    })

    var response = await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        address: address2,
        currency: 'BTC'
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/account/addresses'
    })

    expect(response.statusCode).to.be.equal(200);

  })

  it("POST /v1/api/account/addresses should set an address", async () => {

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
        currency: 'BSV'
      }
    })

  })


  it("DELETE /v1/api/account/addresses should remove an address", async () => {

    await auth(account)({
      method: 'POST',
      url: '/v1/api/account/addresses',
      payload: {
        value: '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K',
        currency: 'BSV'
      }
    })

    await auth(account)({
      method: 'DELETE',
      url: `/v1/api/account/addresses/BSV`
    })

  })

})