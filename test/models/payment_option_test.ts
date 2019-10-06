import * as assert from 'assert';

import { models, log } from '../../lib';

describe("Payment Option Model", () => {

  it('should be related to a valid invoice', async () => {

    var address = 'XbkEikRmZCdmEnKRX7DAiLoJirUu7QqU64',
        currency = 'DASH',
        amount = 0.66959,
        invoice_uid = 'fd6d2d36-3b91-41d9-9c4a-3209a3259ee4';

    var uri = `dash:${address}?amount=${amount}&any=1`;

    let payment = await models.PaymentOption.create({
      currency,
      amount,
      address,
      invoice_uid,
      uri
    });

    assert(payment.id > 0)
    assert.strictEqual(payment.currency, currency);
    assert.strictEqual(payment.amount, amount);
    assert.strictEqual(payment.address, address);
    assert.strictEqual(payment.uri, uri);
    assert.strictEqual(payment.invoice_uid, invoice_uid);

  });

  it('should fail with an invalid invoice uid', async () => {

    var address = 'XbkEikRmZCdmEnKRX7DAiLoJirUu7QqU64',
        currency = 'DASH',
        amount = 0.66959;

    try {    

      let payment = await models.PaymentOption.create({
        currency,
        amount,
        address
      });

    } catch(error) {

      log.error(error.message);

    }

  });

});

