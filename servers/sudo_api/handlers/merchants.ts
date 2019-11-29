
import * as Boom from 'boom'

import { models } from '../../../lib';

import { Op } from 'sequelize';

export async function index(req, h) {

  try {

    let merchants = await  models.Account.findAll({

      where: {

        business_name: {
          [Op.ne]: null
        },

        physical_address: {
          [Op.ne]: null
        }

      },

      include: [{

        model: models.Ambassador,

        as: 'ambassador'

      }]

    });

    return { merchants }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  try {

    let merchant = await  models.Account.findOne({

      where: {

        id: req.params.merchant_id

      },

      include: [{

        model: models.Ambassador,

        as: 'ambassador'

      }]

    });

    return {

      merchant,

      ambassador: merchant.ambassador

    }


  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

