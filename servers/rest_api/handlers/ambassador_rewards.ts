
import * as Boom from 'boom';

import { models } from '../../../lib';

export async function index(req) {

  try {

    let ambassador = await models.Ambassador.findOne({

      where: {

        account_id: req.account.id

      }

    });

    let ambassador_rewards = await models.AmbassadorReward.findAll({

      where: {

        ambassador_id: ambassador.id

      }

    });

    return { ambassador, ambassador_rewards }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

