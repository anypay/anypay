require('dotenv').config();

import {Payment,Invoice} from '../../../types/interfaces';
import {checkAddressForPayments} from '../index';
const assert = require("assert");
const payment: Payment = {
    currency:"dash",
    address:"XhiNxnCJwpwpYrjT6Z9M2YSoNBvurQAmAE",
    amount: .001,
    hash: "351c32abae05ad73f41cff7c11137241aa7a1f0e71c707fdab5794ae15edd469"
};

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"dash",
    amount:.001,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"XhiNxnCJwpwpYrjT6Z9M2YSoNBvurQAmAE",
    status:"paid",
    hash:"351c32abae05ad73f41cff7c11137241aa7a1f0e71c707fdab5794ae15edd469"
}

const badInvoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"dash",
    amount:.001,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"badaddress",
    status:"paid",
    hash:"351c32abae05ad73f41cff7c11137241aa7a1f0e71c707fdab5794ae15edd469"
}

describe("Manual invoice address check", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments("XhiNxnCJwpwpYrjT6Z9M2YSoNBvurQAmAE","DASH");
    console.log(payments)
    assert(payments[0].hash == invoice.hash)
  });
   it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments("XvHmcqFwq3XP4ckW9do2gQhC9U4Sq484WR","DASH");
    console.log(payments)
  });
});
