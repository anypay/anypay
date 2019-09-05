import {generatePaymentRequest} from '../../../plugins/bch/lib/paymentRequest';

import { rpc } from '../../../plugins/bch/lib/jsonrpc'

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 

export async function show(req, h) {

  const params = req.params

  let content = await generatePaymentRequest(params.uid)

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bitcoin.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/payment-request');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
  response.header('digest', `SHA-256=${digest}`);

  return response

}

export async function create(req, h){

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

