
import { log } from '../../../lib/log';

import { createPaymentRequest } from '../../../lib/payment_requests'

export async function create(req, h) {

  try {

    let result = await createPaymentRequest(
      req.app_id,
      req.payload.template,
      req.payload.options
    )

    return h.response(result)

  } catch(error) {

    log.error('pay.request.create.error', error)

    return h.response({ error: error.message }).status(500)

  }

}

