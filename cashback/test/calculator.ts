
import * as assert from 'assert';

import { computeCustomerCashBackAmountForInvoice } from '../lib/calculator';
import { convert } from '../lib/price';

describe("Cashback Calculator", () => {

  describe("determining cash back based on invoice and merchant", () => {

    it("should default to max out at $5", async () => {

      let max = await convert({ amount: 5, currency: 'USD' }, 'BCH');

      let amount = await computeCustomerCashBackAmountForInvoice({
        currency: 'BCH',
        amount: 1
      });

      assert.strictEqual(amount, max);

    });

    it("should default to 10% below the max", async () => {

      let max = await convert({ amount: 5, currency: 'USD' }, 'BCH');

      let amount = await computeCustomerCashBackAmountForInvoice({
        currency: "BCH",
        amount: max
      })

      assert.strictEqual(amount, max * 0.1);

    });

    it.skip("should use merchant settings if available", async () => {

    });

    it("should prefer the invoice amount if allowed", async () => {

      let amount = await computeCustomerCashBackAmountForInvoice({
        currency: 'BCH',
        amount: 1,
        cashback_amount: 0.00777
      });

      assert.strictEqual(amount, 0.00777);

    });

  });

});

