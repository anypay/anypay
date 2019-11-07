
import * as Boom from 'boom';
import { models } from '../../../lib';

export async function show(req, h) {

  try {

    let shareholder = await models.Shareholder.findOne({

      where: {

        account_id: req.account.id

      }

    });

    return { shareholder }

  } catch(error) {

    return Boom.badRequest({ error: error.message });

  }

}
