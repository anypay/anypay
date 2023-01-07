
import { Orm } from './orm'

import { Invoice } from './invoices'

import { models } from './models'

export class PaymentOption extends Orm {

  static model = models.PaymentOption

  invoice: Invoice;

  get amount() {
    return parseFloat(this.get('amount'))
  }

}

export async function findPaymentOption(invoice: Invoice, currency: string): Promise<PaymentOption> {

  let record = await models.PaymentOption.findOne({

    where: { invoice_uid: invoice.uid, currency }

  })

  if (!record) {

    throw new Error(`Unsupported Currency or Chain for Payment Option`)

  }

  return new PaymentOption(record)

}

