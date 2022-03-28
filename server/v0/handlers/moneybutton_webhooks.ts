
import { log } from '../../../lib';

import { submitPayment, SubmitPaymentResponse } from '../../payment_requests/handlers/json_payment_requests';

export async function create(req, h) {

  log.info('moneybutton.webhook', req.payload);

  const { secret, payment } = req.payload;

  log.info('moneybutton.webhook', req.payload)

  if (secret !== process.env.MONEYBUTTON_WEBHOOK_SECRET) {
    throw new Error('invalid moneybutton webhook secret');
  }

  let response: SubmitPaymentResponse = await submitPayment({
    transactions: [payment.rawtx],
    currency: 'BSV',
    invoice_uid: req.payload.payment.buttonId
  })

  log.info('bsv.bip270.broadcast.success', {
    headers: req.headers,
    payload: req.payload,
    response
  })

  return { success: true }

}

