
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import prisma from '@/lib/prisma';
import { Request } from '@hapi/hapi';
interface UpdateNotePayload {
  note: string
}

export async function update(request: AuthenticatedRequest | Request, h: ResponseToolkit) {

  await prisma.addresses.update({
    where: {
      id: request.params.id,
      account_id: (request as AuthenticatedRequest).account.id
    },
    data: {
      note: (request.payload as UpdateNotePayload).note
    }
  })

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      id: request.params.id,
      account_id: (request as AuthenticatedRequest).account.id
    }
  })

  return h.response({address})

}

