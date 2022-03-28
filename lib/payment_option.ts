
import { Orm } from './orm'

import { Invoice } from './invoices'

import { models } from './models'

export class PaymentOption extends Orm {

  invoice: Invoice;

  constructor(invoice: Invoice, record: any) {

    super(record);

    this.invoice = invoice;

  }

  get invoice_uid() {
    return this.invoice.get('uid')
  }

  get currency() {
    return this.invoice.get('currency')
  }

  get amount() {
    return parseInt(this.record.dataValues['amount'])
  }

}

export async function findPaymentOption(invoice: Invoice, currency: string): Promise<PaymentOption> {

  let record = await models.PaymentOption.findOne({

    where: { invoice_uid: invoice.uid, currency }

  })

  if (!record) {

    throw new Error(`${currency} payment option not found for invoice ${invoice.uid}`)

  }

  return new PaymentOption(invoice, record)

}

