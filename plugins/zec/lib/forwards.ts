import { log } from '../../../lib/logger';

import { models } from '../../../lib';

import { forwards } from '../../../lib';

var JSONRPC = require('./jsonrpc');

var rpc = new JSONRPC();

interface Payment {

  currency: string;

  amount: number;

  address: string;

  hash: string;

}

export async function setupPaymentForward(outputAddress: string) {

  let result = await rpc.call('getnewaddress');

  log.info('zec.getnewaddress.result', result);

  let record = await forwards.createPaymentForward({

    input: {

      currency: 'ZEC',

      address: result.result

    },

    output: {

      currency: "ZEC",

      address: outputAddress

    }

  });

  return record;
  
}

export async function forwardPayment(payment: Payment) {
  
  log.info('forwards.getpaymentforwardbyinput', payment.address);

  let paymentForward = await forwards.getPaymentForwardByInput({

    address: payment.address,

    currency: 'ZEC'

  });

  if (!paymentForward) {

    log.info(`no payment forward found for ${payment.address}`);

    return;

  } else {
    
    log.info(`yes payment forward found for ${payment.address} - ${paymentForward.output_address}`);

  }

  let existingPaymentForwardOutput = await models.PaymentForwardOutputPayment.findOne({ where: {

    payment_forward_id: paymentForward.id

  }});

  if (existingPaymentForwardOutput) {

    log.info(`payment already forwarded ${payment.hash}`);

    return;

  }

  let paymentForwardInputPayment = await forwards.createPaymentForwardInputPayment(paymentForward.id, {

    amount: payment.amount,

    txid: payment.hash

  });

  log.info('about to forward payment', payment.hash);

  let rpcResult = await rpc.call('sendtoaddress', [paymentForward.output_address, payment.amount.toString()]);

  log.info('zec.forwardpayment.result', rpcResult);

  let txid = rpcResult.result;


  let paymentForwardOutputPayment = await forwards.createPaymentForwardOutputPayment(
    
    paymentForward.id,
    
    paymentForwardInputPayment.id,

    {
    
      amount: payment.amount,

      txid: txid

    }

  );

  return paymentForwardOutputPayment;

}
