import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { generatePaymentRequest } from '../../../lib/bip70';

export async function create(req: Hapi.Request, h) {

  // https://anypayinc.com/grab-and-go/freshpress-portsmouth/green-on-fleet/purchase
  // /grab-and-go/:account_stub/:item_stub/purchase

  try {

    let account = await models.Account.findOne({
      where: {
        stub: req.params.account_stub
      }
    });

    // look up the item from the url parameters
    let item = await GrabAndGoItem.findOne({

      where: {
        stub: req.params.titem_stub,
        account_id: account.id 
      }

    });

    // create an invoice for the item
    let invoice = await generateInvoice(accountId, item.price, 'BCH');

    let paymentRequest = await generatePaymentRequest(invoice, account);

    const response = h.response(paymentRequest.serialize());

    response.type('application/bitcoincash-paymentrequest');
    response.header('Content-Type', 'application/bitcoincash-paymentrequest');
    response.header('Accept', 'application/bitcoincash-payment');

    return response;


  } catch(error) {

    return Boom.badRequest(error.message);

  }


}

