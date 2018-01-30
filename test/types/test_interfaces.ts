import {Invoice} from '../../types/interfaces'

describe("Interfaces", () => {

  describe("Invoice interface", () => {

    it("should be valid", () => {

      function CheckValidInvoice(invoice: Invoice): Invoice {
        return invoice;
      }

      var invoice = CheckValidInvoice({
        currency: 'BCH',
        amount: 0.1,
        address: 'somevalidaddress',
        denomination: 'USD',
        denomination_amount: 150,
        status: 'unpaid'
      });

      console.log(invoice);
    });

  });

  describe("Payment interface", () => {

    it("should be valid", () => {

    });

  });

});

