
import { models } from '../../../lib';

import { badRequest } from 'boom';

export async function index(req, h) {

  try {

    return models.YelpBusiness.findAll();

  } catch(error) {

    return badRequest(error.message);

  }

}
