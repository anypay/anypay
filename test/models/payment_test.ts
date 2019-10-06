import * as assert from 'assert';

import { models, log } from '../../lib';

describe("Payment Model", () => {

  it('should be related to a valid invoice', async () => {

    var address = 'XbkEikRmZCdmEnKRX7DAiLoJirUu7QqU64',
        currency = 'DASH',
        amount = 0.66959,
        hash = 'f5018fac4b8f2976af5d30717a389a9657b81459d16dace50dea942a435c2539',
        invoice_uid = 'fd6d2d36-3b91-41d9-9c4a-3209a3259ee4'

    let payment = await models.Payment.create({
      currency,
      amount,
      address,
      hash,
      invoice_uid
    });

    assert(payment.id > 0)
    assert.strictEqual(payment.currency, currency);
    assert.strictEqual(payment.amount, amount);
    assert.strictEqual(payment.address, address);
    assert.strictEqual(payment.hash, hash);
    assert.strictEqual(payment.invoice_uid, invoice_uid);

  });

  it('should optionally omit the invoice uid', async () => {

    var address = 'XbkEikRmZCdmEnKRX7DAiLoJirUu7QqU64',
        currency = 'DASH',
        amount = 0.66959,
        hash = 'f5018fac4b8f2976af5d30717a389a9657b81459d16dace50dea942a435c2539';

    let payment = await models.Payment.create({
      currency,
      amount,
      address,
      hash
    });

    assert(payment.id > 0)
    assert.strictEqual(payment.currency, currency);
    assert.strictEqual(payment.amount, amount);
    assert.strictEqual(payment.address, address);
    assert.strictEqual(payment.hash, hash);

  });

  it('should should be invalid without core parameters', async () => {

    try {

      await models.Payment.create()

      assert(false);

    } catch(error) {

      log.error(error.message);
    }

  });

});

