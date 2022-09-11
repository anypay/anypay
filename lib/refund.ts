
import { Invoice } from './invoices'

import { Orm } from './orm'

export class Refund extends Orm {

  original_invoice: Invoice;

  constructor(original_invoice: Invoice, record: any) {

    super(record);

    this.original_invoice = original_invoice;

  }

}

