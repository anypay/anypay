import {Invoice} from '../../types/interfaces';
import "mocha";

describe("Interfaces", () => {

  describe("Invoice interface", () => {

    it("should be valid", () => {

      function CheckValidInvoice(invoice: Invoice): Invoice {
        return invoice;
      }

      var invoice = CheckValidInvoice({
        id: 5,
        account_id: 5,
        uid: '12345',
        currency: 'BCH',
        amount: 0.1,
        address: 'somevalidaddress',
        denomination: 'USD',
        denomination_amount: 150,
        status: 'unpaid'
      });

    });

  });

  describe("Payment interface", () => {

    it("should be valid", () => {

    });

  });

});

