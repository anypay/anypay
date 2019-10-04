
import { models } from '../../../lib';

import * as Boom from 'boom';

export async function index(req, h) {

  try {

    let resp = await  models.AchBatch.findAll({

      order: [['createdAt', 'DESC']]

    });

    return resp;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

