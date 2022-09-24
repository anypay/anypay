
import { expect, server } from '../utils'

import * as utils from '../utils'

describe("Merchants REST API", async () => {

  it("GET /merchants/:id should get a single merchant", async () => {

    let account = await utils.createAccount()

    var response = await server.inject({
      method: 'GET',
      url: `/merchants/${account.id}`
    });

    expect(response.statusCode).to.be.equal(200);

  })

});
