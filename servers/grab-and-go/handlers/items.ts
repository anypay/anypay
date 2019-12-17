import * as Hapi from 'hapi';
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function create(req: Hapi.Request, h) {

  try {

    let grab_and_go_item = await models.findOrCreate({

      where: {

        account_id: req.account.id,

        name: req.payload.name

      },

      defaults: {

        account_id: req.account.id,

        name: req.payload.name

      }

    });

    return { grab_and_go_item }


  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function index(req: Hapi.Request, h) {

  try {

    let grab_and_go_items = models.GrabAndGoItem.findAll({

      where: {

        account_id: req.account.id

      }

    });

    return { grab_and_go_items }


  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

