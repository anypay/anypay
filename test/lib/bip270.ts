require('dotenv').config();
import * as assert from 'assert';
import * as bsv from 'bsv';
import * as moment from 'moment';
import { generatePaymentRequest } from '../../plugins/bsv/lib/paymentRequest';

describe("Creating a BIP 270 Payment Request", () => {
  var invoice;

  before(() => {

    invoice = {
      amount: 0.06065,
      settlement_amount: 0,
      invoice_amount: 0.06065,
      denomination_amount: 25,
      uid: "5ee2b0ef-b637-4e01-9a8a-7c44ffa38897",
      currency: "BSV",
      is_public_request: true,
      replace_by_fee: false,
      expiry: moment().add(15, 'minutes').toDate(),
      complete: false,
      invoice_currency: "BCH",
      denomination_currency: "USD",
      address: "14bFCcHhor5TwrTB4jFprvvmikvDkiDeAb",
      account_id: 165,
      access_token: null,
      hash: null,
      status: "unpaid",
      locked: false,
      uri: "bitcoin:14bFCcHhor5TwrTB4jFprvvmikvDkiDeAb?amount=0.06065",
      settledAt: null,
      paidAt: null,
      createdAt: moment().toDate()
    };

  });

  it("should generate payment request from an invoice", async () => {

    let paymentRequest = await generatePaymentRequest(invoice);

    console.log('payment request', paymentRequest);

    assert(paymentRequest.outputs.length > 0);

    paymentRequest.outputs.forEach((output, index) => {

      let script = new bsv.Script(output.script);

      let address = new bsv.Address(script.getPublicKeyHash());

      if (index === 0) {
        assert.strictEqual(address.toString(), invoice.address);
      }

    });


  });

});

