import {Payment,Invoice} from '../../../types/interfaces';
import {checkAddressForPayments} from '../index';
const assert = require("assert");

const invoice: Invoice = {
    id:1,
    uid:"btown",
    account_id:121212,
    currency:"LTC",
    amount:3.05,
    amount_paid:.001,
    denomination:"USD",
    denomination_amount:0,
    address:"LTWax5jDuPxpQ3nr4umn4eS8DFhjRV1AwK",
    status:"paid",
    hash:"6a422c71e23fd6b88e16ce666d1e4403ae7a09ea36afcd273e0d4b2513ba25d9"
}


describe("Manual invoice address check", () => {
  it("should return payment struct for every recieved transaction from invoice address", async() =>{
    let payments: Payment[]  = await checkAddressForPayments(invoice.address,invoice.currency);
	console.log(payments)
        assert(payments[0].hash == "6a422c71e23fd6b88e16ce666d1e4403ae7a09ea36afcd273e0d4b2513ba25d9");
  });
});

