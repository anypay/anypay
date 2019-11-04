
import * as Boom from 'boom';
import { cashback } from '../../../lib';

export async function index(req, h) {

  try {

    return cashback.listFailures();

  } catch(error) {

    return Boom.badRequest({ error: error.message });

  }
}

