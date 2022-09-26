
import { models } from '../../../lib';

export async function index(req, h) {

  let products = await models.Product.findAll({

    where: {

      account_id: req.account.id

    }

  });

  return { products }

}

