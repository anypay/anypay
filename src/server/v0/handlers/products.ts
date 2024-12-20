import prisma from '@/lib/prisma';
import AuthenticatedRequest from '@/server/auth/AuthenticatedRequest';
import { Request } from '@hapi/hapi';

export async function index(request: AuthenticatedRequest | Request) {

  const products = await prisma.grab_and_go_items.findMany({
    where: {
      account_id: (request as AuthenticatedRequest).account.id
    }
  })

  return { products }

}

