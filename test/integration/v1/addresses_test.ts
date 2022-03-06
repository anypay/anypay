
import { auth, expect } from '../../utils'

import * as utils from '../../utils'

describe("Setting Addresses Via REST", async () => {
  var account;
  
  before(async () => {
  
    account = await utils.generateAccount()

  });

  it("PUT /addresses/DASH should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    let response = await auth(account)({
      method: 'POST',
      url: '/v1/api/addresses',
      payload: {
        address: address,
        currency: "DASH"
      }
    })

    expect(response.result.address.value).to.be.equal(address);

  })

  it("PUT /addresses/BTC should set the BTC address", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    let response = await auth(account)({
      method: 'POST',
      url: '/addresses',
      payload: {
        address: address,
        currency: 'BTC'
      }
    })

    expect(response.result.value).to.be.equal(address);

  })

  it("GET /addresses should return a list of account addresses", async () => {

    const account = await utils.generateAccount()

    var response = await auth(account)({
      method: 'GET',
      url: '/addresses',
      payload: {
        address: address
      }
    })

    expect(response.result.addresses.length).to.be.equal(0);

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

