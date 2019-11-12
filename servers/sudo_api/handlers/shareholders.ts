
import { models } from '../../../lib';
import * as Boom from 'boom';

export async function index(req, h) {

  try {

    let shareholders = await models.Shareholder.findAll();

    return {
      shareholders
    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function update(req, h) {

  try {

    let [numRowsUpdated, shareholder] = await models.Shareholder.update(req.payload, {

      where: { id: req.params.id },

      returning: true

    });

    return { shareholder }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}
