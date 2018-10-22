
import { log } from '../../../lib/logger';

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

  log.info('bch.getnewaddress.result', result);

  let record = await forwards.createPaymentForward({

    input: {

      currency: 'BCH',

      address: result.result

    },

    output: {

      currency: "BCH",

      address: outputAddress

    }

  });

  return record;
  
}

export async function forwardPayment(payment: Payment) {

  let paymentForward = await forwards.getPaymentForwardByInput({

    address: payment.address,

    currency: 'BCH'

  });

  let rpcResult = await rpc.call('sendtoaddress', [paymentForward.output_address, payment.amount.toString()]);

  log.info('bch.forwardpayment.result', rpcResult);

  let txid = rpcResult.result;

  let paymentForwardInputPayment = await forwards.createPaymentForwardInputPayment(paymentForward.id, {

    amount: payment.amount,

    txid: payment.hash

  });

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

