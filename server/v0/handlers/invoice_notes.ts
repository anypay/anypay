
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';
import prisma from '../../../lib/prisma';

export async function create(request: AuthenticatedRequest, h: ResponseToolkit) {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: request.params.invoice_uid,
      account_id: request.account.id
    }
  })

  if (!invoice) { throw new Error('invoice not found') }

  const { note: content } = request.payload as { note: string }

  const note = await prisma.invoice_notes.create({
    data: {
      invoice_uid: String(invoice.uid),
      content,
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  return {

    note

  }

}
