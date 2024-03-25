
import { models } from './models'

import { invoices as Invoice } from '@prisma/client'

import { accounts as Account } from '@prisma/client'

import { payments as Payment } from '@prisma/client'

interface PaymentDetails {
  txid: string;
  currency: string;
  txhex: string;
  txjson?: any;
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
    currency: option.currency,
    chain: option.chain || option.currency,
    account_id: invoice.account_id
  }))

  return record

}

export async function getPayment(invoice: Invoice): Promise<Payment | null> {

  let record = await models.Payment.findOne({
    where: { invoice_uid: invoice.uid }
  })

  if (!record) { return null}

  return record

}

interface PaymentListItem {

  option: any;

  invoice: any

}

export async function listPayments(account: Account, params: {limit: number, offset: number} = {limit: 100, offset: 0}): Promise<PaymentListItem[]> {

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

