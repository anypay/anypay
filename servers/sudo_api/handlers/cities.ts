
import { models } from '../../../lib';

import { badRequest } from 'boom';

export async function index(req, h) {

  try {

    return models.City.findAll();

  } catch(error) {

    return badRequest(error.message);

  }

}
