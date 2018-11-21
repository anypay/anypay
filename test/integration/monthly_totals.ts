import {Server} from '../../servers/rest_api/server';
import * as assert from 'assert';
const Database = require("../../lib/database");

describe("Monthly Totals API", () => {
  var server;

  before(async () => {
    await Database.sync();

    server = await Server();
  });

  describe("GET /totals/monthly/usd", () => {

    it("should return the total dollars in each month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly/usd',
      })

      assert(response.result);

    });

  });

  describe("GET /totals/monthly/transactions", () => {

    it("should return the total nunber of transactions in each month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly/total',
      })

      assert(response.result);

    });

  });

  describe("GET /totals/monthly/btc", () => {

    it("should return total number of btc transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly/btc',
      })

      assert(response.result);

    });

  });

  describe("GET /totals/monthly/bch", () => {

    it("should return total number of bch transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly/bch',
      })

      assert(response.result);

    });

  });

  describe("GET /totals/monthly/dash", () => {

    it("should return total number of dash transacted per month", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly/dash',
      })

      assert(response.result);

    });

  });

  describe("Totals Transactions By Denomination", () => {

    it("GET /totals/monthly/by-denomination-for-currency/{currency}/{start}/{end}", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly-by-denomination-for-currency/DASH/01-01-2018/02-01-2018'
      });

      assert(response.result);
    
    });

    it("GET /totals/monthly/by-denomination/{start}/{end}", async () => {

      let response = await server.inject({
        method: 'GET',
        url: '/totals/monthly-by-denomination/01-01-2018/02-01-2018'
      })

      assert(response.result);
    
    });

  });

});
