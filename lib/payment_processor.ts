require('dotenv').config();

import { Payment, Invoice } from "../types/interfaces";

import {events} from './events';

import {log} from './logger';

import {BigNumber} from 'bignumber.js'
import { models } from './models';

import * as moment from 'moment';


export async function updateOutput(payment: Payment){

  let where = {
    currency: payment.currency,
    address: payment.address
  }

  if (payment.invoice_uid) {
    where['uid'] = payment.invoice_uid
  }

  let invoice = await models.Invoice.findOne({

    where,

    order: [['createdAt', 'DESC']]

  });

  if( invoice && payment.output_hash ){

     var result = await models.Invoice.update({
       output_hash: payment.output_hash,
       output_currency: payment.output_currency,
       output_amount: payment.output_amount,
       output_address: payment.output_address,
       completed_at: new Date()
      },
      {
       where: { id: invoice.id }
      });

     log.info('output hash recorded', payment )

     return result
  }
  
}

export async function receivePayment(payment: Payment) {
  log.info('receive payment', payment);

  let where = {
    currency: payment.currency,
    address: payment.address,
    status: "unpaid"
  }

  if (payment.invoice_uid) {
    where['uid'] = payment.invoice_uid;
  }

  let invoice = await models.Invoice.findOne({
    where,
    order: [['createdAt', 'DESC']]
  });

  if (invoice) {

    return handlePayment(invoice, payment);

  } else {

    return;

  }

}

export async function handlePayment(invoice: Invoice, payment: Payment) {

  /* Check if invoice has expired yet, emit 'invoice.payment.expired'. */

  let expires = moment(invoice.expiry);

  let now = moment(); 

  if (expires.valueOf() < now.valueOf()) {

    log.info('invoice.payment.expired', invoice, payment);

    events.emit('invoice.payment.expired', {
      invoice,
      payment
    });

  }

  if (payment.invoice_uid && payment.invoice_uid !== invoice.uid) {
    log.info('invoice uid does not match payment invoice_uid')
    return;
  }

  /* End Expiration Check */

  if (invoice.amount === payment.amount) {

    await handlePaid(invoice, payment);

  } else {

    throw new Error("invoice neither paid, overpaid, or underpaid");

  }

  return models.Invoice.findOne({ where: { id: invoice.id }});
}

function getInvoicePrice(invoice) {

  let denominationAmount = new BigNumber(invoice.denomination_amount);
  let invoiceAmount = new BigNumber(invoice.invoice_amount);

  return denominationAmount.dividedBy(invoiceAmount);
}

export async function handlePaid(invoice: Invoice, payment: Payment) {
  if (payment.amount < invoice.amount) {
    throw new Error("paid handler called with insufficient payment");
  }

  var result = await models.Invoice.update(
    {
      amount_paid: payment.amount,
      invoice_amount_paid: payment.amount,
      denomination_amount_paid: invoice.denomination_amount,
      hash: payment.hash,
      locked: payment.locked,
      replace_by_fee: payment.replace_by_fee,
      status: "paid",
      paidAt: new Date(),
      complete: true,
      output_hash: payment.output_hash,
      output_currency: payment.output_currency,
      output_amount: payment.output_amount,
      output_address: payment.output_address,
      completed_at: new Date()
    },
    {
      where: { id: invoice.id }
    }
  );


  
  if (result[0] === 1) {

    events.emit('invoice.paid', invoice)
    events.emit('invoice.payment', invoice.uid)
    return invoice;
  } else {
    throw new Error("error updating invoice");
  }
}

