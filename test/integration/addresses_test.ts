

import {  auth, expect  } from '../utils'

import * as utils from '../utils'

describe("Setting Addresses Via REST", async () => {
  var account;
  
  before(async () => {
  
    account = await utils.generateAccount()

  });

  it("PUT /addresses/DASH should set the DASH address", async () => {

    var address = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    let response = await auth(account, 0)({
      method: 'PUT',
      url: '/addresses/DASH',
      payload: {
        address: address
      }
    })

    expect(response.result.value).to.be.equal(address);

  })

  it("PUT /addresses/BTC should set the BTC address", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    let response = await auth(account, 0)({
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address: address
      }
    })

    expect(response.result.value).to.be.equal(address);

  })

  it("GET /addresses should return a list of account addresses", async () => {

    var address = '1KNk3EWYfue2Txs1MThR1HLzXjtpK45S3K';

    const account = await utils.generateAccount()

    var response = await auth(account, 0)({
      method: 'GET',
      url: '/addresses',
      payload: {
        address: address
      }
    })

    expect(response.result).to.deep.equal({});

    const address2 = 'XojEkmAPNzZ6AxneyPxEieMkwLeHKXnte5';

    await auth(account, 0)({
      method: 'PUT',
      url: '/addresses/BTC',
      payload: {
        address: address
      }
    })

    response = await auth(account, 0)({
      method: 'GET',
      url: '/addresses',
      payload: {
        address: address
      }
    })

    expect(Object.keys(response.result).length).to.be.equal(1);

    await auth(account, 0)({
      method: 'PUT',
      url: '/addresses/DASH',
      payload: {
        address: address2
      }
    })

    response = await auth(account, 0)({
      method: 'GET',
      url: '/addresses',
      payload: {
        address: address
      }
    })

    expect(response.statusCode).to.be.equal(200);

    expect(Object.keys(response.result).length).to.be.equal(2);

    expect(response.result['BTC']).to.be.equal(address);

    expect(response.result['DASH']).to.be.equal(address2);

  })

})

