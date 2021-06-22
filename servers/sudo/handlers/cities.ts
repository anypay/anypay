
import { models } from '../../../lib';

import { badRequest } from 'boom';

export async function index(req, h) {

  try {

    return models.City.findAll();

  } catch(error) {
    console.log(error);

    return badRequest(error.message);

  }

}

export async function create(req, h) {

  try {

    let city = await models.City.findOrCreate({
      where: {
        stub: req.payload.stub,
      },
      defaults: req.payload
    });

    return { city };

  } catch(error) {

    return badRequest(error.message);

  }

}

export async function update(req, h) {

  try {

    let city = await models.City.findOne({
      where: {
        stub: req.params.id,
      }
    });

    await city.updateAttributes(req.payload); 


    city = await models.City.findOne({
      where: {
        stub: req.params.id,
      }
    });

    return {
      city
    }

  } catch(error) {

    return badRequest(error.message);

  }

}
