
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

import { Op } from 'sequelize';

export async function index(req, h: ResponseToolkit) {

  try {

    let achs = await models.AchBatch.findAll({

      where: {
        account_id: req.account.id
      },

      order: [["effective_date", "desc"]]
    });

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

