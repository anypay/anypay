import * as Hapi from 'hapi'; import * as Boom from 'boom';

import {generatePaymentRequest as createBSVRequest} from '../../../plugins/bsv/lib/paymentRequest';

import {generatePaymentRequest as createDASHRequest} from '../../../plugins/dash/lib/paymentRequest';

import { show as showPaymentRequest } from '../../rest_api/handlers/payment_requests'

import { logInfo, logError } from '../../../lib/logger'

import { models, invoices, plugins } from '../../../lib';

import { BigNumber } from 'bignumber.js';

import * as moment from 'moment';

export async function create(req: Hapi.Request, h) {

  console.log('params', req.params);

  // https://anypayinc.com/grab-and-go/freshpress-portsmouth/green-on-fleet/purchase
  // /grab-and-go/:account_stub/:item_stub/purchase

  console.log(req.headers);

  var currency;

  if (req.headers.accept === 'application/dash-paymentrequest') {
    currency = 'DASH';
  } else if (req.headers.accept === 'application/bitcoincash-paymentrequest') {
    currency = 'BCH';
  } else {
    currency = 'BSV';
  } 

  let account = await models.Account.findOne({
    where: {
      stub: req.params.account_stub
    }
  });

  console.log('account', account.toJSON());

  // look up the item from the url parameters
  var item = await models.Product.findOne({

    where: {
      stub: req.params.item_stub,
      account_id: account.id 
    }

  });

  if (!item) {
    throw new Error(`item ${req.params.item_stub} for account not found`);
  }

  let invoice = await invoices.generateInvoice(account.id, item.price, currency);

  if (item.square_catalog_object_id) {

    invoice.external_id = item.square_catalog_object_id;

    await invoice.save();

  }

  await models.GrabAndGoInvoice.create({

    invoice_uid: invoice.uid,

    item_id: item.id

  });

  req.account = account
  req.account_id = account.id
  req.invoice_uid = invoice.uid
  req.uid = invoice.uid

  try {

    return showPaymentRequest(req, h);

  } catch(error) {

    logError('showpaymentrequest.error', error.message)
    return Boom.badRequest(error.message)

  }

}

export async function submitPayment(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  try {

    let plugin = await plugins.findForCurrency(req.params.currency);

    await Promise.all(

      req.payload.transactions.map(async (transaction) => {

        let resp = await plugin.submitTransaction(transaction);

        console.log(transaction, resp);

      })
    )

    return req.payload;

  } catch(error) {

    console.log(error.message);

    return Boom.badRequest(error.message);

  }

}

async function createGrabAndGoInvoice(item_uid: string, currency: string) {

    logInfo('grab-and-go.invoices.create', { item_uid, currency })

    // look up the item from the url parameters
    let item = await models.Product.findOne({

      where: {
        uid: item_uid
      }

    });

    if (!item) {
      throw new Error(`item ${item_uid} for account not found`);
    }

    let invoice = await invoices.generateInvoice(item.account_id, item.price, currency);

    if (item.square_catalog_object_id) {

      invoice.external_id = item.square_catalog_object_id;

      await invoice.save();

    } else {

      console.log('item no object id', item.toJSON());
    
    }

    await models.GrabAndGoInvoice.create({

      invoice_uid: invoice.uid,

      item_id: item.id

    });

    return { invoice, item };

}

export async function createByItemUid(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  logInfo('grab-and-go.payment_requests.createByItemUid', { headers: req.headers, params: req.params })

  var currency;
  if (req.headers.accept === 'application/bitcoin-paymentrequest') {
    currency = 'BTC';
  } else if (req.headers.accept === 'application/dash-paymentrequest') {
    currency = 'DASH';
  } else if (req.headers.accept === 'application/bitcoincash-paymentrequest') {
    currency = 'BCH';
  } else if (req.headers.accept === 'application/simpleledger-paymentrequest') {
    currency = 'BCH';
  } else {
    currency = 'BSV';
  } 

  try {

    let { invoice, item } = await createGrabAndGoInvoice(req.params.item_uid, currency);

    let account = await models.Account.findOne({ where: { id: item.account_id }});

    req.account = account
    req.account_id = account.id
    req.params.invoice_uid = invoice.uid
    req.params.uid = invoice.uid

    return showPaymentRequest(req, h)

  } catch(error) {

    console.log(error);
    console.log(error.message);

    return Boom.badRequest(error.message);

  }

}

async function generateInvoice(accountId, itemPrice, currency) {
  return {};  
};

