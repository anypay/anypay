
import { getRefund } from '../../../lib/refunds'

import { ensureInvoice } from '../../../lib/invoices'

import { log } from '../../../lib'
import AuthenticatedRequest from '../../auth/AuthenticatedRequest'
import { ResponseToolkit } from '@hapi/hapi'
import { badRequest } from '@hapi/boom'

export async function show(request: AuthenticatedRequest, h: ResponseToolkit) {

  try {

    let invoice = await ensureInvoice(request.params.invoice_uid)

    if (invoice.account_id !== request.account.id) {

      return h.response({ error: 'unauthorized' }).code(401)
    }
   
    let refund = await getRefund(invoice)

    let refund_invoice = await ensureInvoice(refund.get('refund_invoice_uid'))

    return h.response({
      refund: refund.toJSON(),
      original_invoice: invoice,
      refund_invoice: refund_invoice
    })

  } catch(error: any) {

    log.error('servers.v1.handlers.Refunds.show', error)

    return badRequest(error.message)

  }

}
