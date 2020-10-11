
import * as Boom from 'boom'
import { models, pay } from '../../../lib'

export async function show(req, h) {

  let uid = req.params.uid
  let currency = req.params.currency

  let record = await models.Bip70PaymentRequest.findOne({
    where: {
      invoice_uid: uid,
      currency
    }
  })

  if (record) {

    let decoded = pay.bip70.paymentRequestToJSON(record.hex, currency)

    return Object.assign(decoded, {
      invoice_uid: uid,
      currency
    })

  } else {

    let paymentRequest: pay.PaymentRequest = await pay.buildPaymentRequestForInvoice({
      uid,
      currency,
      protocol: 'BIP70'
    })

    let hex = paymentRequest.content.serialize().toString('hex')

    let decoded = pay.bip70.paymentRequestToJSON(hex, currency)

    return Object.assign(decoded, {
      invoice_uid: uid,
      currency
    })

  }


}
