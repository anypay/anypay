import * as Boom from 'boom';
import { models } from '../../../lib/models';

export async function create(req, h) {

  console.log(req.params);

  try {

    let merchant = await models.Account.update({

      ambassador_id: req.params.ambassador_id
      
    }, {

      where: {

        id: req.params.merchant_id

      }

    });

    return merchant;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

