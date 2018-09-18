require('dotenv').config();

import * as assert from 'assert';
import * as Database from "../../lib/database";
import {monthly} from '../../lib/totals';
import {totalMerchants} from '../../lib/totals';

describe("Monthly Totals By Account", () => {

  var accountId = 1;

  before(async () => {
    await Database.sync();
  });

  describe("monthly totals for DASH", async () => {

    it("should return the monthly totals for the acocunt", async () => {

      let totals = await monthly.forAccount(accountId).forCurrency('DASH');

      assert(totals.length >= 0);
    });

  });

  describe("monthly totals for BCH", () => {

    it("should return the monthly totals for the acocunt", async () => {

      let totals = await monthly.forAccount(accountId).forCurrency('BCH');

      assert(totals.length >= 0);
    });

  });

  describe("monthly totals for ZEC", () => {

    it("should return the monthly totals for the acocunt", async () => {

      let totals = await monthly.forAccount(accountId).forCurrency('ZEC');

      assert(totals.length >= 0);
    });

  });

  describe("total number of transactions by month", () => {

    it("#totalTransactions should return total transactions by month", async () => {

      let result = await monthly.totalTransactions(); 

      assert(result.length > 12);

    });

    it("totalTransactionsByCoin should aggregate by coin by month", async () => {

      let result = await monthly.totalTransactionsByCoin('DASH');

      console.log('total DASH transactions by month', result);

      result.map(month => {

        assert(month.total >= 0);

      });

    })

  });

});

describe("Total Merchants", () => {

  it("totalMerchants should return the total number of merchants", async () => {

    let total = await totalMerchants();

    console.log('total', total);

    assert(total > 0);

  });

});

