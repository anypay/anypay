
import { auth, v0AuthRequest, expect } from '../../utils'

import * as utils from '../../utils'

describe("Setting Addresses Via REST", async () => {

  it.skip('V1', async () => {

    const account = await utils.generateAccount()

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    var response = await v0AuthRequest(account, {
      method: 'GET',
      url: '/v1/api/account/addresses',
      payload: {
        address: address
      }
    })

    expect(response.result['BTC']).to.be.equal(0);

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    await auth(account)({
      method: 'POST',
      url: '/v1/api/addresses',
      payload: {
        address: address,
        currency: "BTC"
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/addresses'
    })

    expect(response.result.addresses.length).to.be.equal(1);

    await auth(account, 0)({
      method: 'POST',
      url: '/v1/api/addresses',
      payload: {
        address: address2,
        currency: 'BTC'
      }
    })

    response = await auth(account)({
      method: 'GET',
      url: '/v1/api/addresses'
    })

    expect(response.statusCode).to.be.equal(200);

    expect(response.result.addresses.length).to.be.equal(2);

    expect(response.result.addresses[0].value).to.be.equal(address);

    expect(response.result.addresses[1].value).to.be.equal(address2);

  })

})

