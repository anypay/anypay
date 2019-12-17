import * as Hapi from 'hapi';
import * as Boom from 'boom';

export async function index(req: Hapi.Request, h) {

  try {


  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

