require('dotenv').config();
import {Payment,Invoice} from '../../../types/interfaces';
import {checkAddressForPayments} from '../index';
const assert = require("assert");

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"DOGE",
    amount:3.05,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"DP6zy4ThmjorMqnbei36cS3BdLxshVdzsM",
    status:"paid",
    hash:"f4d4bf7cb7e870f748837f8937f5d58c0eb360c5cb3691501830b748092edae8"
}

describe("Manual invoice address check", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments(invoice.address,invoice.currency);
	console.log(payments)
        assert(payments[0].address == invoice.address)
  });
});

