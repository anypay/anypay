
import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from '@/lib/prisma';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';

export async function show(request: Request | AuthenticatedRequest, h: ResponseToolkit) {

  const payment_options = await prisma.payment_options.findMany({
    where: {
      invoice_uid: request.params.invoice_uid
    }
  })

  return { payment_options }

}

