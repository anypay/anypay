
import { ResponseToolkit } from '@hapi/hapi';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';
import prisma from '../../../lib/prisma';

interface UpdateNotePayload {
  note: string
}

export async function update(request: AuthenticatedRequest, h: ResponseToolkit) {

  await prisma.addresses.update({
    where: {
      id: request.params.id,
      account_id: request.account.id
    },
    data: {
      note: (request.payload as UpdateNotePayload).note
    }
  })

  const address = await prisma.addresses.findFirstOrThrow({
    where: {
      id: request.params.id,
      account_id: request.account.id
    }
  })

  return h.response({address})

}

