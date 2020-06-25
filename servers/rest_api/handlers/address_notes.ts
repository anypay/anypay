
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function update(req, h) {

  try {

    let address = await models.Address.findOne({

      where: {

        account_id: req.account.id,

        id: req.params.id

      }

    });

    if (!address) {

      throw new Error('authorized address not found');

    }

    address.note = req.payload.note;

    await address.save();

    return { address }

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message);

  }

}

