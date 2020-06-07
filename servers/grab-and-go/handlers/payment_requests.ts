import * as Hapi from 'hapi'; import * as Boom from 'boom';

import { generatePaymentRequest } from '../../../lib/bip70';

import {generatePaymentRequest as createBSVRequest} from '../../../plugins/bsv/lib/paymentRequest';

import {generatePaymentRequest as createDASHRequest} from '../../../plugins/dash/lib/paymentRequest';

import { models, invoices } from '../../../lib';

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
  var item = await models.GrabAndGoItem.findOne({

    where: {
      stub: req.params.item_stub,
      account_id: account.id 
    }

  });

  console.log('ITEM', item.toJSON());

  if (!item) {
    throw new Error(`item ${req.params.item_stub} for account not found`);
  }

  let invoice = await invoices.generateInvoice(account.id, item.price, currency);

  console.log('INVOICE CREATED', invoice.toJSON());

  if (item.square_catalog_object_id) {

    console.log('SQUARE OBJECT ID', item.square_catalog_object_id);

    invoice.external_id = item.square_catalog_object_id;

    await invoice.save();

  } else {

    console.log('item no object id', item.toJSON());
  
  }

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

}

async function handleEdge(req: Hapi.Request, h: Hapi.ResponseToolkit) {

  console.log('edgewallet.detected'); 

  let currency = req.headers['x-currency'];

  if (!currency) {
    //throw new Error('x-currency header must be provided with value such as BCH,DASH,BSV')
    currency = 'DASH'
  }

  let { invoice, item } = await createGrabAndGoInvoice(req.params.item_uid, currency);

  let amount = new BigNumber(invoice.amount);

  if (invoice.address.match(/\:/)) {
    invoice.address = invoice.address.split(':')[1];
  }

  const paymentRequest = {
    "network": "main",
    "currency": invoice.currency,
    "requiredFeeRate": 1,
    "outputs": [
        {
            "amount": amount.times(100000000).toNumber(),
            "address": invoice.address
        }
    ],
    "time": moment().toDate(),
    "expires": moment().add(15, 'minutes').toDate(),
    "memo": `Payment request for Anypay invoice ${invoice.uid}`,
    "paymentUrl": `https://anypayinc.com/payments/edge/${invoice.currency}/${invoice.uid}`,
    "paymentId": invoice.uid
  }

  console.log(paymentRequest);

  let response = h.response(paymentRequest);

  response.type('application/payment-request');

  response.header('Content-Type', 'application/payment-request');

  response.header('Accept', 'application/payment');

  return response;

}

async function createGrabAndGoInvoice(item_uid: string, currency: string) {
    // look up the item from the url parameters
    let item = await models.GrabAndGoItem.findOne({

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
  var isEdge = false;

  /* Detect EDGE Wallet for Bitpay's JSON Protocol Support */


  if (req.headers['x-requested-with'] === 'co.edgesecure.app') {

    return handleEdge(req, h);

  }

  console.log("HEADERS", req.headers);

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

    var paymentRequest, response;

    switch(currency) {
    case 'BCH':

      paymentRequest = await generatePaymentRequest(invoice, account);

      response = h.response(paymentRequest.serialize());

      response.type('application/bitcoincash-paymentrequest');

      response.header('Content-Type', 'application/bitcoincash-paymentrequest');

      response.header('Accept', 'application/bitcoincash-payment');

      return response;

    case 'DASH':

      paymentRequest = await generatePaymentRequest(invoice, account);

      response = h.response(paymentRequest.serialize());

      response.type('application/dash-paymentrequest');

      response.header('Content-Type', 'application/dash-paymentrequest');

      response.header('Accept', 'application/dash-payment');

      return response;

    case 'BTC':

      paymentRequest = await generatePaymentRequest(invoice, account);

      response = h.response(paymentRequest.serialize());

      response.type('application/bitcoin-paymentrequest');

      response.header('Content-Type', 'application/bitcoin-paymentrequest');

      response.header('Accept', 'application/bitcoin-payment');

      return response;

    case 'BSV':

      let paymentOption = await models.PaymentOption.findOne({
      
        where: {

          invoice_uid: invoice.uid,

          currency: 'BSV'

        }

      });

      paymentRequest = await createBSVRequest(invoice, paymentOption, {
        name: item.name,
        image_url: item.image_url
      });

      response = h.response(paymentRequest);

      response.type('application/json'); 

      response.header('Content-Type', 'application/json');

      response.header('Accept', 'application/json');

      return response;
    }


  } catch(error) {

    console.log(error);
    console.log(error.message);

    return Boom.badRequest(error.message);

  }

}

async function generateInvoice(accountId, itemPrice, currency) {
  return {};  
};

