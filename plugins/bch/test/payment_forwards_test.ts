require('dotenv').config()

import * as assert from 'assert';

import { forwards } from '../';

describe('BCH Payment Forwards', () => {

  it('setupPaymentForward should generate an address and save a payment_forward record', async () => {

    let outputAddress = 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht';

    let paymentForward = await forwards.setupPaymentForward(outputAddress);

    assert(paymentForward.input_address);
    assert.strictEqual(paymentForward.input_currency, 'BCH');

    assert.strictEqual(paymentForward.output_currency, 'BCH');
    assert.strictEqual(paymentForward.output_address, outputAddress);

  });

});

