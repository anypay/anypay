
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req, h: ResponseToolkit) {

  try {

    let kiosks = await models.VendingMachine.findAll({

      where: {
        account_id: req.account.id
      }

    });

    return { kiosks };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

