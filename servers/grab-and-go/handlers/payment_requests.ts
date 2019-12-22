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

    let invoice = await invoices.generateInvoice(account.id, item.price, 'BCH');

    await models.GrabAndGoInvoice.create({

      invoice_uid: invoice.uid,

      item_id: item.id

    });

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

export async function createByItemUid(req: Hapi.Request, h) {

  console.log('params', req.params);

  // https://anypayinc.com/grab-and-go/freshpress-portsmouth/green-on-fleet/purchase
  // /grab-and-go/:account_stub/:item_stub/purchase

  try {

    // look up the item from the url parameters
    let item = await models.GrabAndGoItem.findOne({

      where: {
        uid: req.params.item_uid
      }

    });

    console.log('item', item.toJSON());

    if (!item) {
      throw new Error(`item ${req.params.item_uid} for account not found`);
    }

    let invoice = await invoices.generateInvoice(item.account_id, item.price, 'BCH');

    await models.GrabAndGoInvoice.create({

      invoice_uid: invoice.uid,

      item_id: item.id

    });

    let account = await models.Account.findOne({ where: { id: item.account_id }});

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

async function generateInvoice(accountId, itemPrice, currency) {
  return {};  
};

