
import { Orm } from './orm'

import { Invoice } from './invoices'

import { models } from './models'

export class PaymentOption extends Orm {

  static model = models.PaymentOption

  invoice: Invoice;

  get amount() {
    return parseFloat(this.get('amount'))
  }

  get currency() {
    return this.get('currency')
  }

  get chain() {
    return this.get('chain')
  }

  get invoice_uid() {
    return this.get('invoice_uid')
  }

  get address() {
    return this.get('address')
  }

  get outputs() {
    return this.get('outputs')
  }

}

export async function findPaymentOption({
  invoice, currency, chain
}: {
  invoice: Invoice,
  currency: string
  chain? : string
}): Promise<PaymentOption> {

  let record = await models.PaymentOption.findOne({

    where: { invoice_uid: invoice.uid, currency }

  })

  if (!record) {

    throw new Error(`Unsupported Currency or Chain for Payment Option`)

  }

  return new PaymentOption(record)

}

