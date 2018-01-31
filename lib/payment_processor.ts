const InvoiceModel = require('./models/invoice');
import {Payment, Invoice} from '../types/interfaces';

export async function handlePayment(invoice: Invoice, payment: Payment) {

  if (invoice.amount === payment.amount) {

    return handlePaid(invoice, payment);

  } else if (payment.amount < invoice.amount) {

    return handleUnderpaid(invoice, payment);

  } else if (payment.amount > invoice.amount) {

   return handleOverpaid(invoice, payment);
  }
}

export async function handleUnderpaid(invoice: Invoice, payment: Payment) {

  if (payment.amount >= invoice.amount) {
    throw new Error('underpaid handler called with sufficient payment');
  }

  invoice.amount_paid = payment.amount;
  invoice.hash = payment.hash;
  invoice.status = 'underpaid';
  invoice.paidAt = new Date();

  var result = await InvoiceModel.update({
    amount_paid: invoice.amount,
    hash: invoice.hash,
    status: invoice.status,
    paidAt: invoice.paidAt
  }, {
    where: { id: invoice.id } 
  })

  if (result[0] === 1) {
    return invoice;
  } else {
    throw new Error('error updating invoice');
  }
}

export async function handlePaid(invoice: Invoice, payment: Payment) {

  if (payment.amount >= invoice.amount) {
    throw new Error('underpaid handler called with sufficient payment');
  }

  invoice.amount_paid = payment.amount;
  invoice.hash = payment.hash;
  invoice.status = 'paid';
  invoice.paidAt = new Date();

  var result = await InvoiceModel.update({
    amount_paid: payment.amount,
    hash: payment.hash,
    status: 'paid',
    paidAt: new Date()
  }, {
    where: { id: invoice.id }
  });

  if (result[0] === 1) {
    return invoice;
  } else {
    throw new Error('error updating invoice');
  }
}

export async function handleOverpaid(invoice: Invoice, payment: Payment) {

  if (payment.amount <= invoice.amount) {
    throw new Error('overpaid handler called with insufficient payment');
  }
  if (payment.amount === invoice.amount) {
    throw new Error('overpaid handler called with exactly sufficient payment');
  }

  invoice.amount_paid = payment.amount;
  invoice.hash = payment.hash;
  invoice.status = 'paid';
  invoice.paidAt = new Date();
  
  var result = await InvoiceModel.update({
    amount_paid: invoice.amount_paid,
    hash: invoice.hash,
    status: invoice.status,
    paidAt: invoice.paidAt
  }, {
    where: { id: invoice.id } 
  })

  if (result[0] === 1) {
    return invoice;
  } else {
    throw new Error('error updating invoice');
  }
}

