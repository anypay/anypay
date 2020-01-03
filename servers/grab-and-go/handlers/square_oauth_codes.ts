
import * as Boom from 'boom';

import { models, square } from '../../../lib';

export async function create(req, h) {

  try {

    let resp = await square.getToken(req.payload.code);

    let square_oauth_credentials = await models.SquareOauthCredentials.create({

      code: req.payload.code,

      account_id: req.account.id,

      access_token: resp.access_token,

      refresh_token: resp.refresh_token,

      square_merchant_id: resp.merchant_id

    });

    return { square_oauth_credentials }

  } catch(error) {

    console.error(error);

    return Boom.badRequest(error.message);

  }

}

