
import { Orm } from './orm'

import { Invoice } from './invoices'

export class PaymentOption extends Orm {

  invoice: Invoice;

  constructor(invoice: Invoice, record: any) {

    super(record);

    this.invoice = invoice;

  }

}

