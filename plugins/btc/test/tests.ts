require('dotenv').config();
import {Payment,Invoice} from '../../../types/interfaces';
import {checkAddressForPayments} from '../index';
const assert = require("assert");
const payment: Payment = {
    currency:"BTC",
    address:"XhiNxnCJwpwpYrjT6Z9M2YSoNBvurQAmAE",
    amount: .001,
    hash: "351c32abae05ad73f41cff7c11137241aa7a1f0e71c707fdab5794ae15edd469"
};

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"BTC",
    amount:.00172,
    amount_paid:.00172,
    denomination:"USD",
    denomination_amount:0,
    address:"13ruWaYKrjrSJrDL1iUgJ3Dr5Wf2f64GCg",
    status:"paid",
    hash:"79aca524d53afb7a8e52b1956773044ae7a2214e12842a3c34c4e026f54c32c6"
}

describe("Manual invoice address check", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments(invoice.address,invoice.currency);
    console.log(payments)
    assert(payments[0].hash == invoice.hash)
  });
});

