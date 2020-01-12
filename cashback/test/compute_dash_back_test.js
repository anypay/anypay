const assert = require('assert');
const DashBack = require('../lib/dash_back');

describe('DashBack', () => {

  it("computeForMerchant should be a minimum of $1", async () => {

    let invoiceAmount = 2;

    let dollarAmount = await DashBack.computeForMerchant(invoiceAmount);
  
    assert.strictEqual(dollarAmount, 1);

  });

  it("computeForMerchant should be 20% if greater than $1", async () => {

    let invoiceAmount = 15;

    let dollarAmount = await DashBack.computeForMerchant(invoiceAmount);

    assert.strictEqual(dollarAmount, 3);

  });

  it("computeForMerchant should be a maximum of $20", async () => {

    let invoiceAmount = 200;

    let dollarAmount = await DashBack.computeForMerchant(invoiceAmount);

    assert.strictEqual(dollarAmount, 20);

  });

  it("computeForCustomer should be 10% if greater than $1", async () => {

    let invoiceAmount = 15;

    let dollarAmount = await DashBack.computeForCustomer(invoiceAmount);

    assert.strictEqual(dollarAmount, 1.5);

  });

  it("computeForCustomer should be a minimum of $1", async () => {

    let invoiceAmount = 5;

    let dollarAmount = await DashBack.computeForCustomer(invoiceAmount);

    assert.strictEqual(dollarAmount, 1);

  });

  it("computeForCustomer should be a maximum of $10", async () => {

    let invoiceAmount = 120;

    let dollarAmount = await DashBack.computeForCustomer(invoiceAmount);

    assert.strictEqual(dollarAmount, 10);

  });
});

