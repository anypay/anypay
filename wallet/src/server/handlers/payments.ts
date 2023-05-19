
import log from '../../log'

import { badRequest } from 'boom'

import { listPayments, Payment } from '../../payments'

export async function index(req, h) {

  try {

    let payments: Payment[] = await listPayments()

    return {

      payments

    }

    log.debug('api.handlers.Payments.index.result', payments)


  } catch(error) {

    log.error('api.handlers.Payments.index', error)

  }

}
