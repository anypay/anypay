import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { generatePaymentRequest } from '../../../lib/bip70';
import { models, invoices } from '../../../lib';

export async function create(req: Hapi.Request, h) {

  console.log('params', req.params);

  // https://anypayinc.com/grab-and-go/freshpress-portsmouth/green-on-fleet/purchase
  // /grab-and-go/:account_stub/:item_stub/purchase

  try {

    let account = await models.Account.findOne({
      where: {
        stub: req.params.account_stub
      }
    });

    console.log('account', account.toJSON());

    // look up the item from the url parameters
    let item = await models.GrabAndGoItem.findOne({

      where: {
        stub: req.params.item_stub,
        account_id: account.id 
      }

    });

    console.log('item', item.toJSON());

    if (!item) {
      throw new Error(`item ${req.params.item_stub} for account not found`);
    }

    // create an invoice for the item
    let invoice = await invoices.generateInvoice(account.id, item.price, 'BCH');

    //console.log('invoice', invoice.toJSON());

    let paymentRequest = await generatePaymentRequest(invoice, account);

    const response = h.response(paymentRequest.serialize());

    response.type('application/bitcoincash-paymentrequest');
    response.header('Content-Type', 'application/bitcoincash-paymentrequest');
    response.header('Accept', 'application/bitcoincash-payment');

    return response;

  } catch(error) {

    console.log(error);
    console.log(error.message);

    return Boom.badRequest(error.message);

  }

}

