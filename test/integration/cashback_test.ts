require('dotenv').config();

import {Server} from '../../servers/rest_api/server';

import * as assert from 'assert';

describe("Cash Back API", () => {

  var server;

  before(async () => {

    server = await Server();
  });

  describe("Getting Total Cash Back Paid", () => {

    describe("Cash Back Paid To Merchants", () => {

      it.skip("should return the total dollars in each month", async () => {

        let response = await server.inject({
          method: 'GET',
          url: '/cashback/totals/alltime',
        })

        console.log(response.result);

        assert(response.result.totals.all >= 0);

        assert(response.result.totals.merchants >= 0);

      });

    });

    describe("Cash Back Paid To Shoppers", () => {

      it.skip("should return the total dollars in each month", async () => {

        let response = await server.inject({
          method: 'GET',
          url: '/cashback/totals/alltime',
        })

        assert(response.result.totals.all >= 0);

        assert(response.result.totals.customers >= 0);

      });

    });

  });

});

