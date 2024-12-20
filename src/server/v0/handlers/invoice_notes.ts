
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import prisma from '@/lib/prisma';
import { Request } from '@hapi/hapi';

export async function create(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: request.params.invoice_uid,
      account_id: (request as AuthenticatedRequest).account.id
    }
  })

  if (!invoice) { throw new Error('invoice not found') }

  const { note: content } = request.payload as { note: string }

  const note = await prisma.invoice_notes.create({
    data: {
      invoice_uid: invoice.uid,
      content,
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  return {

    note

  }

}
