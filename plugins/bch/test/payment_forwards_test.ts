require('dotenv').config()

import * as assert from 'assert';

import { forwards } from '../';

import { models } from '../../../lib';

describe('BCH Payment Forwards', () => {

  it('setupPaymentForward should generate an address and save a payment_forward record', async () => {

    let outputAddress = 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht';

    let paymentForward = await forwards.setupPaymentForward(outputAddress);

    assert(paymentForward.input_address);
    assert.strictEqual(paymentForward.input_currency, 'BCH');

    assert.strictEqual(paymentForward.output_currency, 'BCH');
    assert.strictEqual(paymentForward.output_address, outputAddress);

  });

  it('#forwardPayment should send payment and create input and output records', async () => {

    let outputAddress = 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht';

    let paymentForward = await forwards.setupPaymentForward(outputAddress);

    let txid = '0589778c2e95b58b9ae2d8dcc616d6bf8dd587646d933450f4f878f3cb9b6f69'; // note does not match forwarding address

    let payment = {

      currency: 'BCH',

      amount: 0.001,

      address: paymentForward.input_address,

      hash: txid

    };

    let paymentForwardOutputPayment = await forwards.forwardPayment(payment);

    assert.strictEqual(paymentForwardOutputPayment.payment_forward_id, paymentForward.id);

    assert.strictEqual(parseFloat(paymentForwardOutputPayment.amount), payment.amount);

    let paymentForwardInputPayment = await models.PaymentForwardInputPayment.findOne({ where: {

      id: paymentForwardOutputPayment.payment_forward_input_payment_id

    }});

    assert.strictEqual(paymentForwardInputPayment.payment_forward_id, paymentForward.id);

    assert(paymentForwardInputPayment.txid);

    assert.strictEqual(parseFloat(paymentForwardInputPayment.amount), payment.amount);

  });

  it('#forwardPayment should be idempotent, rejecting duplicate forwards', async () => {


    let outputAddress = 'bitcoincash:qrup980ejnvjk8v8vawt5w59nc8nk08d6gc0nvylht';

    let paymentForward = await forwards.setupPaymentForward(outputAddress);

    let txid = '0589778c2e95b58b9ae2d8dcc616d6bf8dd587646d933450f4f878f3cb9b6f69'; // note does not match forwarding address

    let payment = {

      currency: 'BCH',

      amount: 0.001,

      address: paymentForward.input_address,

      hash: txid

    };

    let paymentForwardOutputPayment = await forwards.forwardPayment(payment);

    assert(!paymentForwardOutputPayment, 'payment should not be forwarded twice');

  });

});

