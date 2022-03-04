
import { expect, server, spy } from '../utils'

import * as merchants from '../../lib/merchants'

import * as utils from '../utils'

describe("Merchants REST API", async () => {

  it("GET /merchants should list merchants with physical addresses", async () => {

    let account = await utils.createAccount()

    await account.set('physical_address', '110 State St, Portsmouth, NH')
    await account.set('business_name', 'Free State Bitcoin Shoppe')

    let response = await server.inject({
      method: 'GET',
      url: '/merchants'
    });

    expect(response.result.merchants.length).to.be.greaterThan(0);

    expect(response.result.merchants[0].physical_address).to.be.a('string');

    expect(response.result.merchants[0].business_name).to.be.a('string');

    expect(response.result.merchants[0].latitude).to.be.equal(null);

    expect(response.result.merchants[0].longitude).to.be.equal(null);

  });

  it("GET /merchants should merchants active by time frame", async () => {

    spy.on(merchants, 'listActiveSince')

    var response = await server.inject({
      method: 'GET',
      url: '/merchants'
    });

    expect(response.result.merchants).to.be.an('array');

    expect(response.result.oneWeek).to.be.an('array');

    expect(merchants.listActiveSince).to.have.been.called.with(1, 'week')

    expect(response.result.oneMonth).to.be.an('array');

    expect(merchants.listActiveSince).to.have.been.called.with(1, 'month')

    expect(response.result.threeMonths).to.be.an('array');

    expect(merchants.listActiveSince).to.have.been.called.with(3, 'months')

  });

});

