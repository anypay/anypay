require('dotenv').config();

import { Payment, Invoice } from "../types/interfaces";

import {emitter} from './events';

import {log} from './logger';

import {BigNumber} from 'bignumber.js'
import * as models from './models';

import * as moment from 'moment';

export async function receivePayment(payment: Payment) {
  log.info('receive payment', payment);

  let invoice = await models.Invoice.findOne({
    where: {
      currency: payment.currency,
      address: payment.address,
      status: "unpaid"
    },
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

    emitter.emit('invoice.payment.expired', {
      invoice,
      payment
    });

  }

  /* End Expiration Check */

  if (invoice.amount === payment.amount) {

    await handlePaid(invoice, payment);

  } else if (payment.amount < invoice.amount) {

    await handleUnderpaid(invoice, payment);

  } else if (payment.amount > invoice.amount) {

    await handleOverpaid(invoice, payment);

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

export async function handleUnderpaid(invoice: Invoice, payment: Payment) {
  if (payment.amount >= invoice.amount) {
    throw new Error("underpaid handler called with sufficient payment");
  }

  let paymentAmount = new BigNumber(payment.amount);

  let price = getInvoicePrice(invoice);

  var result = await models.Invoice.update(
    {
      amount_paid: paymentAmount.toNumber(),
      invoice_amount_paid: paymentAmount.toNumber(),
      denomination_amount_paid: paymentAmount.times(price).toFixed(2),
      hash: payment.hash,
      locked: payment.locked,
      status: 'underpaid',
      paidAt: new Date(),
      complete: true,
      output_hash: payment.output_hash,
      completed_at: new Date()
    },
    {
      where: { id: invoice.id }
    }
  );

  if (result[0] === 1) {
    emitter.emit('invoice.underpaid', invoice)
    emitter.emit('invoice.payment', invoice.uid)
    return invoice;
  } else {
    throw new Error("error updating invoice");
  }
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
      status: "paid",
      paidAt: new Date(),
      complete: true,
      output_hash: payment.output_hash,
      completed_at: new Date()
    },
    {
      where: { id: invoice.id }
    }
  );


  
  if (result[0] === 1) {

    emitter.emit('invoice.paid', invoice)
    emitter.emit('invoice.payment', invoice.uid)
    return invoice;
  } else {
    throw new Error("error updating invoice");
  }
}

export async function handleOverpaid(invoice: Invoice, payment: Payment) {
  if (payment.amount <= invoice.amount) {
    throw new Error("overpaid handler called with insufficient payment");
  }
  if (payment.amount === invoice.amount) {
    throw new Error("overpaid handler called with exactly sufficient payment");
  }

  console.log("handleOverpaid", payment)

  let paymentAmount = new BigNumber(payment.amount);

  let price = getInvoicePrice(invoice);

  var result = await models.Invoice.update(
    {
      amount_paid: paymentAmount.toNumber(),
      invoice_amount_paid: paymentAmount.toNumber(),
      denomination_amount_paid: paymentAmount.times(price).toFixed(2),
      hash: payment.hash,
      locked: payment.locked,
      status: 'overpaid',
      paidAt: new Date(),
      complete: true,
      output_hash: payment.output_hash,
      completed_at: new Date()
    },
    {
      where: { id: invoice.id }
    }
  );

  if (result[0] === 1) {
    emitter.emit('invoice.overpaid', invoice)
    emitter.emit('invoice.payment', invoice.uid)
    return invoice;
  } else {
    throw new Error("error updating invoice");
  }
}
