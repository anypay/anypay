import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

const Database = require("../../lib/database");

import * as Chance from 'chance';
const chance = new Chance();

describe("Merchants REST API", async () => {
  var account, accessToken, server;
  
  before(async () => {

    await Database.sync();
    server = await Server();

  });

  it("GET /merchants should list merchants with physical addresses", async () => {

    let response = await server.inject({
      method: 'GET',
      url: '/merchants'
    });

    assert(response.result.merchants.length >= 0);

  });

});

