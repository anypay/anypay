
import * as Boom from 'boom';

export async function create(req, h) {

  try {

    return {
      params: req.params,
      query: req.query,
      payload: req.payload
    }

  } catch(error) {

    console.error(error);

    return Boom.badRequest(error.message);

  }

}
