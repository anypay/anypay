
import { models } from './models'

import { Invoice } from './invoices'

import { PaymentOption } from './payment_option'

import { Orm } from './orm'

import { ensurePaymentOption } from './payment_options';

import { log } from './log';

interface PaymentDetails {
  txid: string;
  currency: string;
  txhex: string;
  txjson?: any;
}

interface NewPayment {
  record: any;
  invoice: Invoice;
  option: PaymentOption;
}

export class Payment extends Orm {

  static model = models.Payment;

  invoice: Invoice

  option: PaymentOption;

  constructor(newPayment: NewPayment) {

    super(newPayment.record);

    this.invoice = newPayment.invoice;

    this.option = newPayment.option;

  }

  toJSON() {

    return { 

      currency: this.currency,

      txid: this.txid,

      createdAt: this.get('createdAt'),

      outputs: this.outputs,

      tx_hex: this.get('txhex'),

      tx_json: this.get('txjson')

    }

  }

  get outputs() {
    return this.option.get('outputs')
  }

  get currency() {
    return this.get('currency')
  }

  get txid() {
    return this.get('txid')
  }

}

export class MultiplePaymentsError extends Error {}

export { PaymenOptionNotFoundError } from './payment_options'

export async function recordPayment(invoice: Invoice, details: PaymentDetails): Promise<Payment> {

  log.info('payments.recordPayment', { invoice_uid: invoice.get('uid'), details })

  let payment = await getPayment(invoice)

  if (payment) {

    throw new MultiplePaymentsError()
    
  }
  console.log('__PAYMENT GOT', payment)

  const option = await ensurePaymentOption(invoice, details.currency)

  console.log('__OPTION', option)

  console.log('__INVOICE', invoice)

  var record;

  try {


    record = await models.Payment.create(Object.assign(details, {
      invoice_uid: invoice.get('uid'),
      payment_option_id: option.id,
      account_id: invoice.get('account_id')
    }))


  } catch(error) {

    console.log('ERROR__', error)

  }

  console.log('__RECORD', record)

  log.info('payments.recordPayment.result', record.toJSON())

  return new Payment({ record, invoice, option })

}

export async function getPayment(invoice: Invoice): Promise<Payment> {

  let record = await models.Payment.findOne({
    where: { invoice_uid: invoice.uid }
  })

  if (!record) { return }

  let option = await models.PaymentOption.findOne({
    where: { invoice_uid: invoice.uid, currency: record.currency }
  })

  return new Payment({ record, invoice, option })

}

export async function listPayments(account, params: {limit: number, offset: number} = {limit: 100, offset: 0}): Promise<Payment> {

  return models.Payment.findAll({

    where: {

      account_id: account.id,

    },

    limit: params.limit,

    offset: params.offset,

    order: [["createdAt", "desc"]],

    include: [{

      model: models.PaymentOption,

      as: 'option'

    },{

      model: models.Invoice,

      as: 'invoice',

      attributes: ['uid', 'currency', 'amount', 'denomination_currency', 'denomination_amount']

    }]

  })

}

