
import { Request } from 'hapi';

import { models } from '../../../lib';

import * as Boom from 'boom';

import * as hapiSequelize from '../../../lib/hapi_sequelize';

import { Op } from 'sequelize';

export async function index(req: Request) {

  let { order, limit, offset } = hapiSequelize.parseRequest(req);

  const where = {};

  if (req.query.failed) {

    where['error'] = {
      [Op.ne]: null
    };
    where['txid'] = {
      [Op.eq]: null
    }
  }

  try {

    let ambassador_rewards = await models.AmbassadorReward.findAll({
      where,
      order,
      limit,
      offset
    });

    return { ambassador_rewards };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

};

