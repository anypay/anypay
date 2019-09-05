import {generatePaymentRequest} from '../../../plugins/bch/lib/paymentRequest';

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

  switch (req.headers.accept) {

    case 'application/verify-payment':

      var payment = JSON.parse(Object.keys(req.payload)[0])

      return {

        payment: payment,

        memo: "This looks good for now, we will see what the miners say."

      }

    case 'application/payment':

      throw new Error(`payment not yet implemented`);

    default:

      throw new Error(`request type ${req.headers.accept} not accepted`);
  }


}

