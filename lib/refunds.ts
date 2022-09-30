
import { Invoice } from './invoices'
import { Refund } from './refund'

import { models } from './models'

import { createPaymentRequest } from './payment_requests'

import { getDecodedTransaction, CURRENCIES } from './blockchair'

interface RefundAddress {
  currency: string;
  value: string;
  invoice: Invoice;
}

const REFUND_APP_ID = 130;

export async function getRefund(invoice: Invoice): Promise<Refund> {

  const original_invoice_uid = invoice.uid

  let record = await models.Refund.findOne({
    where: {
      original_invoice_uid
    }
  })

  if (!record) {

    let { value: address } = await getAddressForInvoice(invoice)

    console.log(invoice.toJSON())

    const template = [{
      currency: invoice.get('invoice_currency'),
      to: [{
        address,
        amount: parseFloat(invoice.get('denomination_amount_paid')),
        currency: invoice.denomination
      }]
    }]

    let payment_request = await createPaymentRequest(
      REFUND_APP_ID,
      template,
      {}
    )

    let refund_invoice_uid = payment_request.get('uid')

    record = await models.Refund.create({
      original_invoice_uid,
      refund_invoice_uid,
      status: 'unpaid',
      address
    })

  }

  return new Refund(invoice, record)

}

export async function getAddressForInvoice(invoice: Invoice): Promise<RefundAddress> {

  if (invoice.status === 'unpaid') {
    throw new Error('cannot refund unpaid invoice')
  }
  
  const currency = CURRENCIES[invoice.get('currency')]

  let rawtx = await getDecodedTransaction(currency, invoice.get('hash'))

  let inputTx = await getDecodedTransaction(currency, rawtx.vin[0].txid)

  return {
    currency: invoice.get('currency'),
    invoice,
    value: inputTx.vout[rawtx.vin[0].vout].scriptPubKey.addresses[0]
  }
}
