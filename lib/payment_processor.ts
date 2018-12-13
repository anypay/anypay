const InvoiceModel = require("./models/invoice");
import { Payment, Invoice } from "../types/interfaces";
import {emitter} from './events';

export async function handlePayment(invoice: Invoice, payment: Payment) {
  if (invoice.amount === payment.amount) {
    console.log("handle paid");
    return handlePaid(invoice, payment);
  } else if (payment.amount < invoice.amount) {
    return handleUnderpaid(invoice, payment);
  } else if (payment.amount > invoice.amount) {
    return handleOverpaid(invoice, payment);
  } else {
    throw new Error("invoice neither paid, overpaid, or underpaid");
  }
}

export async function handleUnderpaid(invoice: Invoice, payment: Payment) {
  if (payment.amount >= invoice.amount) {
    throw new Error("underpaid handler called with sufficient payment");
  }

  let price = invoice.denomination_amount / invoice.invoice_amount;

  var result = await InvoiceModel.update(
    {
      amount_paid: payment.amount,
      invoice_amount_paid: payment.amount,
      denomination_amount_paid: (payment.amount * price).toFixed(2),
      hash: payment.hash,
      status: 'underpaid',
      paidAt: new Date()
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

  var result = await InvoiceModel.update(
    {
      amount_paid: payment.amount,
      invoice_amount_paid: payment.amount,
      denomination_amount_paid: invoice.denomination_amount,
      hash: payment.hash,
      status: "paid",
      paidAt: new Date()
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

  let price = invoice.denomination_amount / invoice.invoice_amount;

  var result = await InvoiceModel.update(
    {
      amount_paid: payment.amount,
      invoice_amount_paid: payment.amount,
      denomination_amount_paid: (payment.amount * price).toFixed(2),
      hash: payment.hash,
      status: 'overpaid',
      paidAt: new Date()
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
