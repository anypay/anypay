import {Payment,Invoice} from '../../../types/interfaces';
import {getAddressPayments} from '../index';
const assert = require("assert");

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"doge",
    amount:3.05,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"DP6zy4ThmjorMqnbei36cS3BdLxshVdzsM",
    status:"paid",
    hash:"f4d4bf7cb7e870f748837f8937f5d58c0eb360c5cb3691501830b748092edae8"
}

const badInvoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"doge",
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
    let payments: Payment[]  = await getAddressPayments(invoice);
	console.log(payments)
        assert(payments.length == 4)
  });
  it("should not return payment struct for unpaid transactions", async () =>{
    let payments: Payment[]  = await getAddressPayments(badInvoice);
    assert(payments == null)
   });	
});

