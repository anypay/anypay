
import { v0AuthRequest, expect } from '../../utils'

import * as utils from '../../utils'

describe("Setting Addresses Via REST", async () => {
  var account;
  
  before(async () => {
  
    account = await utils.generateAccount()

  });

  it("PUT /addresses/DASH should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    let response = await v0AuthRequest(account, {
      method: 'PUT',
      url: '/addresses/DASH',
      payload: {
        address: address
      }
    })

    expect(response.result.value).to.be.equal(address);
    expect(response.result.currency).to.be.equal('DASH');

  })

  it("PUT /addresses/BTC should set the BTC address", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    let response = await v0AuthRequest(account, {
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address
      }
    })

    expect(response.result.value).to.be.equal(address);

  })

  it("GET /addresses should return a list of account addresses", async () => {

    const account = await utils.generateAccount()

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    await v0AuthRequest(account, {
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address
      }
    })

    var response = await v0AuthRequest(account, {
      method: 'GET',
      url: '/addresses',
      payload: {
        address
      }
    })

    expect(response.result['BTC']).to.be.equal(address)

  })

})

