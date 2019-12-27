
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

export async function create(req, h) {

  try {

    let ach_batch = await  models.AchBatch.create(req.payload);

    return { ach_batch };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}


