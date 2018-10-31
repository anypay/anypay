require('dotenv').config();
  
import {createInvoice} from '../index';

require('dotenv').config();

describe("Creating an invoice", () => {

  it ("should return an array of payments", async () => {

    let accountID  = 1;
  
    let amount = 1

    let invoice  = await createInvoice(accountID, amount);

    console.log(invoice);


  });

});
