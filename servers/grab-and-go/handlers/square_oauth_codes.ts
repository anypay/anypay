
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function create(req, h) {

  try {

    let square_oauth_credentials = await models.SquareOauthCredentials.create({

      code: req.payload.code,

      account_id: req.account.id

    });

    return { square_oauth_credentials }

  } catch(error) {

    console.error(error);

    return Boom.badRequest(error.message);

  }

}

