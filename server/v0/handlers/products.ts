import { models } from '../../../lib';
import AuthenticatedRequest from '../../auth/AuthenticatedRequest';

export async function index(request: AuthenticatedRequest) {

  let grab_and_go_items = await models.Product.findAll({

    where: {

      account_id: request.account.id

    }

  });

  return { grab_and_go_items }

}

