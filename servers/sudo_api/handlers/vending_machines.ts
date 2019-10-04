
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h) {

  try {

    let vending_machines = await  models.VendingMachine.findAll();

    return { vending_machines }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

