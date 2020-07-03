import {generatePaymentRequest} from '../../../plugins/dash/lib/paymentRequest';

import { rpc } from '../../../plugins/dash/lib/jsonrpc'

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

export async function create(req, h) {

  console.log('HEADERS');
  console.log(req.headers);

  console.log('PAYLOAD');
  console.log(req.payload);

  if (req.headers.accept === 'application/verify-payment') {

    return {

      payment: req.payload,

      memo: "This looks good for now, we will see what the miners say."

    }

  }

  if (req.headers['x-content-type'] === 'application/payment') {

    req.payload.transactions.forEach(async (hex) => {

      console.log("BROADCAST", hex);

      try {

        let resp = await rpc.call('sendrawtransaction', [hex]);

        console.log('resp', resp);

      } catch(error) {

        console.log('could not broadcast transaction', hex);

      }

    });

    return {

      payment: {

        transactions: req.payload.transactions 

      },

      memo: "Transaction received by Anypay. Invoice will be marked as paid if the transaction is confirmed."

    }

  }

}

