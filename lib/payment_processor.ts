const Invoice = require('./models/invoice');
import {Payment} from '../types/interfaces';

export async function handlePayment(invoice, payment: Payment) {

  if (invoice.amount === payment.amount) {

    return handlePaid(invoice, payment);

  } else if (payment.amount < invoice.amount) {

    return handleUnderpaid(invoice, payment);

  } else if (payment.amount > invoice.amount) {

   return handleOverpaid(invoice, payment);
  }
}

export async function handleUnderpaid(invoice, payment: Payment) {

  if (payment.amount >= invoice.amount) {
    throw new Error('underpaid handler called with sufficient payment');
  }

  var invoice = await invoice.updateAttributes({
    amount_paid: payment.amount,
    hash: payment.hash,
    status: 'underpaid',
    paidAt: new Date()
  })

  return invoice;
}

export async function handlePaid(invoice, payment: Payment) {

  if (payment.amount >= invoice.amount) {
    throw new Error('underpaid handler called with sufficient payment');
  }

  var invoice = await invoice.updateAttributes({
    amount_paid: payment.amount,
    hash: payment.hash,
    status: 'paid',
    paidAt: new Date()
  })

  return invoice;
}

export async function handleOverpaid(invoice, payment: Payment) {

  if (payment.amount <= invoice.amount) {
    throw new Error('overpaid handler called with insufficient payment');
  }
  if (payment.amount === invoice.amount) {
    throw new Error('overpaid handler called with exactly sufficient payment');
  }
  
  var invoice = await invoice.updateAttributes({
    amount_paid: payment.amount,
    hash: payment.hash,
    status: 'overpaid',
    paidAt: new Date()
  })

  return invoice;
}

