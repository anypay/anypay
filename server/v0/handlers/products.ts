import prisma from '../../../lib/prisma';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';

export async function index(request: AuthenticatedRequest) {

  const products = await prisma.grab_and_go_items.findMany({
    where: {
      account_id: request.account.id
    }
  })

  return { products }

}

