
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req: Request, h: ResponseToolkit) {

  try {
  
    var params;

    if (req.params && req.params.account_id) {

      params = { where: { account_id: req.params.account_id }};

    }

    let achs = await models.AccountAch.findAll(params);

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

