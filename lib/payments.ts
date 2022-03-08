
import { models } from './models'

import { Invoice } from './invoices'

import { PaymentOption } from './payment_option'

import { Orm } from './orm'

interface Output {
  address: string;
  amount: number;
}

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

class Payment extends Orm {

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

      outputs: this.outputs

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

export async function recordPayment(invoice: Invoice, details: PaymentDetails): Promise<Payment> {

  let payment = await getPayment(invoice)

  if (payment) {

    throw new Error('Multiple payments for invoice not allowed')
  }

  let option = await models.PaymentOption.findOne({ where: {

    invoice_uid: invoice.uid,

    currency: details.currency  

  }})

  if (!option) {

    throw new Error(`Currency ${details.currency} was not a Payment Option for Invoice ${invoice.uid}`)

  }

  let record = await models.Payment.create(Object.assign(details, {
    invoice_uid: invoice.uid,
    payment_option_id: option.id,
    account_id: invoice.get('account_id')
  }))

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

      attributes: ['uid', 'currency', 'amount']

    }]

  })

}

