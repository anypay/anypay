
import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from '../../../lib/prisma';

export async function show(request: Request, h: ResponseToolkit) {

  const payment_options = await prisma.payment_options.findMany({
    where: {
      invoice_uid: request.params.invoice_uid
    }
  })

  return { payment_options }

}

