
import { ResponseToolkit } from '@hapi/hapi';
import { models } from '../../../lib';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  let invoice = await models.Invoice.findOne({

    where: {

      uid: request.params.invoice_uid,
      account_id: request.account.id

    }
  })

  if (!invoice) { throw new Error('invoice not found') }

  const { note: content } = request.payload as { note: string }

  let note = await models.InvoiceNote.create({
    invoice_uid: invoice.uid,
    content,
  });

  return {

    note

  }

}
