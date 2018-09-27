require('dotenv').config();
import {Payment,Invoice} from '../../../types/interfaces';
import {checkAddressForPayments} from '../index';
const assert = require("assert");
const payment: Payment = {
    currency:"ZEC",
    address:"t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq",
    amount: 2.5,
    hash: "t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq"
};

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"ZEC",
    amount:2.5,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq",
    status:"paid",
    hash:"a51b2834f9b6f2f6c2f4dc636aa05356b5453cbba96168a0f6057ffb3219c8ec"
}


describe("Manual invoice address check", () => {
  it.skip("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments(invoice.address, invoice.currency);
    assert(payments[0].address == invoice.address)
  });
});

