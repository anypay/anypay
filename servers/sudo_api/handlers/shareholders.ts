
import { models } from '../../../lib';
import * as Boom from 'boom';

export async function index(req, h) {

  try {

    let shareholders = await models.Shareholder.findAll({
      include: [
        { model: models.ShareholderDocument, as: 'shareholder_documents' }
      ]
    });

    return {
      shareholders
    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req) {

  try {

    let shareholder = await models.Shareholder.findOne({
      where: {
        id: req.params.id
      }
    });

    if (!shareholder) {

      return Boom.notFound();
    }

    let documents = await models.ShareholderDocument.findAll({

      where: {

        shareholder_id: shareholder.id

      }

    });

    return {
      shareholder,
      documents
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
