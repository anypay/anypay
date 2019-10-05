
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req: Request, h: ResponseToolkit) {

  try {

    let achs = await models.AccountAch.findAll({

      where: {
        account_id: req.account.id
      },

      include: {
        model: models.AchBatch,
        as: 'batch'
      }

    });

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

