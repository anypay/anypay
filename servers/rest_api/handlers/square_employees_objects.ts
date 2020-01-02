
import * as Boom from 'boom';

export async function index (req, h) {

  try {

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show (req, h) {

  try {

    return { success: true }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

