
import * as Hapi from 'hapi';

import { Request } from 'hapi';

import { models, ambassadors } from '../../../lib';

import * as _ from 'lodash';

import * as Boom from 'boom';

import { Op } from 'sequelize';

export async function index(req: Request) {

  try {

    let ambassadors = await models.Ambassador.findAll({
      includes: [{
        model: models.Account,
        as: 'merchants'
      }]
    });

    let merchants = await models.Account.findAll({

      where: {

        ambassador_id: {
          
          [Op.in]: ambassadors.map(a => a.id)

        }

      }

    });

    return { ambassadors, merchants };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

};

