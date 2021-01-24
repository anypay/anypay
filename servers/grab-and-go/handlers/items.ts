import * as Boom from 'boom';

import { models } from '../../../lib';

export async function create(req, h) {

  try {

    let grab_and_go_item = await models.GrabAndGoItem.findOrCreate({

      where: {

        account_id: req.account.id,

        name: req.payload.name

      },

      defaults: {

        account_id: req.account.id,

        name: req.payload.name,

        image_url: req.payload.image_url,

        price: req.payload.amount

      }

    });

    return { grab_and_go_item }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function index(req, h) {

  try {

    let grab_and_go_items = await models.GrabAndGoItem.findAll({

      where: {

        account_id: req.account.id

      }

    });

    return { grab_and_go_items }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

