import {checkAddressForPayments} from '../index';

require('dotenv').config();
  
import {Payment,Invoice} from '../../../types/interfaces';

const assert = require("assert");

describe("Checking address for payments", () => {

  it ("should return an array of payments", async () => {

    let address = 'znTdCH8u6G9bviMVwuQGtcuYdMhoHVJXSaN';

    let payments = await checkAddressForPayments(address, 'ZEN');

    console.log(payments);

    for( let i = 0; i<payments.length;i++){
      assert(payments[i].address == address)
    }

    assert(payments[0].amount == 2.22277017)

    assert(payments[1].amount == .07490649)


  });
  
 


});

