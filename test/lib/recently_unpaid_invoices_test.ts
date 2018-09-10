import * as assert from 'assert';

import * as moment from 'moment';

import {getRecentlyUnpaidInvoices} from '../../lib/core';

describe("Recently Generated Unpaid Invoices", () => {

  describe("core#getRecentlyUnpaidInvoices", () => {

    it("should return all recently generated invoices", async () => {

      let recentlyUnpaidInvoices = await getRecentlyUnpaidInvoices();

      assert(recentlyUnpaidInvoices.length > 0);

    });

    it("should unpaid invoices from last month", async () => {

      let date = moment().subtract(30, 'days').toDate();

      let recentlyUnpaidInvoices = await getRecentlyUnpaidInvoices(date);

      assert(recentlyUnpaidInvoices.length > 0);

    });

    it("should restrict to a single coin", async () => {

      let date = moment().subtract(30, 'days').toDate();

      let currency = 'BCH';

      let recentlyUnpaidInvoices = await getRecentlyUnpaidInvoices(date, currency);

      assert(recentlyUnpaidInvoices.length > 0);

    });

  });

});

