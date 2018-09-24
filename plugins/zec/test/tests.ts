import {Payment,Invoice} from '../../../types/interfaces';
import {getAddressPayments} from '../index';
const assert = require("assert");
const payment: Payment = {
    currency:"zec",
    address:"t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq",
    amount: 2.5,
    hash: "t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq"
};

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"zec",
    amount:2.5,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"t3P5KKX97gXYFSaSjJPiruQEX84yF5z3Tjq",
    status:"paid",
    hash:"a51b2834f9b6f2f6c2f4dc636aa05356b5453cbba96168a0f6057ffb3219c8ec"
}

const badInvoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"zec",
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
//    assert(payments[0].hash == invoice.hash)
  });
  it("should not return payment struct for unpaid transactions", async () =>{
    let payments: Payment[]  = await getAddressPayments(badInvoice);
    assert(payments == null)
   });	
});

