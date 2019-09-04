import {generatePaymentRequest} from '../../../plugins/bch/lib/paymentRequest';

const bch = require('bsv'); 
const Message = require('bsv/message'); 

export async function show(req, h){

  const params = req.params

  let content = await generatePaymentRequest(params.uid)

  let digest = bch.crypto.Hash.sha256(Buffer.from(JSON.stringify(content))).toString('hex'); 

  var privateKey = bch.PrivateKey.fromWIF(process.env.JSON_PROTOCOL_IDENTITY_WIF);

  var signature = Message(digest).sign(privateKey); 

  let response = h.response(content);

  response.type('application/payment-request');

  response.header('x-signature-type', 'ecc');
  response.header('x-identity',process.env.JSON_PROTOCOL_IDENTITY_ADDRESS );
  response.header('signature', signature );
  response.header('digest', digest);

  return response

}
