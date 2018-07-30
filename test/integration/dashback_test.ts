require('dotenv').config();

import {Server} from '../../servers/rest_api/server';

import * as assert from 'assert';

describe("Dash Back API", () => {

  var server;

  before(async () => {

    server = await Server();
  });

  describe("Getting Total Dash Back Paid", () => {

    describe("Dash Back Paid To Merchants", () => {

      it("should return the total dollars in each month", async () => {

        let response = await server.inject({
          method: 'GET',
          url: '/dashback/totals/alltime',
        })

        console.log(response.result);

        assert(response.result.totals.all >= 0);

        assert(response.result.totals.merchants >= 0);

      });

    });

    describe("Dash Back Paid To Shoppers", () => {

      it("should return the total dollars in each month", async () => {

        let response = await server.inject({
          method: 'GET',
          url: '/dashback/totals/alltime',
        })

        assert(response.result.totals.all >= 0);

        assert(response.result.totals.customers >= 0);

      });

    });

  });

});

