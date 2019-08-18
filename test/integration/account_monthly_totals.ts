import { Server } from '../../servers/rest_api/server';
import * as assert from 'assert';

import { database } from '../../lib';

describe("Account Monthly Totals API", () => {
  var server;

  before(async () => {
    await database.sync();

    server = await Server();
  });

  describe("GET /account/totals/monthly/usd", () => {

    it("should return the total dollars in each month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/account/totals/monthly/usd',
      })

      assert(response.result);

    });

  });

  describe("GET /account/totals/monthly/transactions", () => {

    it("should return the total nunber of transactions in each month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/account/totals/monthly/total',
      })

      assert(response.result);

    });

  });

  describe("GET /account/totals/monthly/btc", () => {

    it("should return total number of btc transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/account/totals/monthly/btc',
      })

      assert(response.result);

    });

  });

  describe("GET /account/totals/monthly/bch", () => {

    it("should return total number of bch transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/account/totals/monthly/bch',
      })

      assert(response.result);

    });

  });

  describe("GET /account/totals/monthly/dash", () => {

    it("should return total number of dash transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/account/totals/monthly/dash',
      })

      assert(response.result);

    });

  });

});
