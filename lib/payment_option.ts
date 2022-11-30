
import { Orm } from './orm'

import { Invoice } from './invoices'

import { models } from './models'

export class PaymentOption extends Orm {

  static model = models.PaymentOption

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

  get address() {
    return this.get('address')
  }

  get outputs() {
    return this.get('outputs')
  }
  
}

export async function findPaymentOption(invoice: Invoice, currency: string): Promise<PaymentOption> {

  let record = await models.PaymentOption.findOne({

    where: { invoice_uid: invoice.uid, currency }

  })

  if (!record) {

    throw new Error(`Unsupported Currency or Chain for Payment Option`)

  }

  return new PaymentOption(invoice, record)

}

