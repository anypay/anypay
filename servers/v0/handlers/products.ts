import { models } from '../../../lib';

export async function index(req, h) {

  let grab_and_go_items = await models.Product.findAll({

    where: {

      account_id: req.account.id

    }

  });

  return { grab_and_go_items }

}

