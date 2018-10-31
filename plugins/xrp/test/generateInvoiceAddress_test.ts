require('dotenv').config();
  
import {generateInvoiceAddress} from '../index';

require('dotenv').config();

describe("Generating xrp invoice address", () => {

  it ("should generate an address with a serialized destination tag", async () => {

    let address = 'r3pzYrVu7oruSJh1jhACmb6wRDkTWVw1JJ';

    let invoiceAddress = await generateInvoiceAddress(address);

    console.log(invoiceAddress);

  });

});
