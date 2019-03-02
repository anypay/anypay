require('dotenv').config();
import {checkAddressForPayments} from '../index';
const assert = require("assert");

const invoice= {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"RVN",
    amount:39.7296,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"SUrkjP2LU5x7M1dQYGYCiKVzB2PwVqeLof",
    status:"paid",
    hash:"6870a0c356c4baeb82a23dca299567e2bd5616d10adb42e0716884e7977857ae"
}


describe("Manual invoice address check", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments = await checkAddressForPayments(invoice.address, invoice.currency);
    console.log(payments)
    assert(payments[0].address == invoice.address)
  });
});

