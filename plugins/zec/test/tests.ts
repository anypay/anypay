require('dotenv').config();

import {Payment,Invoice} from '../../../types/interfaces';

import {checkAddressForPayments} from '../index';

const assert = require("assert");

const payment: Payment = {
    currency:"ZEC",
    address:"zs1hurv06qx6qvfxl2wvaj2dzsjdk29k4y4c7ndrh8afth22phch47xz7jfr5pjw78z34ewg25v422",
    amount: 0.0019,
    hash: "cb91425cda45f7630430c10384cb2a7e98338ecbeb1e03aab9e80bbbc0a432ad"
};

describe("checkAddressForPayments", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments = await checkAddressForPayments(payment.address, payment.currency);
    assert(payments[0].address == payment.address)
  });
});

