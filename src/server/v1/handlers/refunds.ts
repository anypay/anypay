
import { getRefund } from '@/lib/refunds'

import { ensureInvoice } from '@/lib/invoices'

import { log } from '@/lib'
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest'
import { Request, ResponseToolkit } from '@hapi/hapi'
import { badRequest } from '@hapi/boom'

export async function show(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  try {

    let invoice = await ensureInvoice(request.params.invoice_uid)

    if (invoice.account_id !== (request as AuthenticatedRequest).account.id) {

      return h.response({ error: 'unauthorized' }).code(401)
    }
   
    let refund = await getRefund(invoice)

    let refund_invoice = await ensureInvoice(refund.refund_invoice_uid)

    return h.response({
      refund: refund,
      original_invoice: invoice,
      refund_invoice: refund_invoice
    })

  } catch(error: any) {

    log.error('servers.v1.handlers.Refunds.show', error)

    return badRequest(error.message)

  }

}
