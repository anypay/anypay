import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';

import { database, models } from "../../lib";

import * as Chance from 'chance';
const chance = new Chance();

describe("Merchants REST API", async () => {
  var account, accessToken, server;
  
  before(async () => {

    await database.sync();
    server = await Server();

  });

  it.skip("GET /address_routes/:currecy/:address should get the route", async () => {

    var bchAddress = 'bitcoincash:qrzta75m5zp7x66ghfmnua7sf7vkkz5gqcznkdmqnw';
    var dashAddress = 'XhRQfmFYBKRGzPb8cP1opzZmotZCVQVRbf';

    let addressRoute = await models.AddressRoute.create({

      input_currency: 'DASH',

      input_address: dashAddress,

      output_currency: 'BCH',

      output_address: bchAddress,

    });

    let response = await server.inject({
      method: 'GET',
      url: `/routes/DASH/${dashAddress}`
    });

    assert.strictEqual(response.result.output.currency, 'BCH');
    assert.strictEqual(response.result.output.address, bchAddress);

  });

});

