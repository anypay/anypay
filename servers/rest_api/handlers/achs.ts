
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

import { Op } from 'sequelize';

export async function index(req: Request, h: ResponseToolkit) {

  try {

    let achs = await models.AccountAch.findAll({

      where: {
        account_id: req.account.id
      },

      include: [{
        model: models.AchBatch,
        as: 'batch'
      }, {

        model: models.AccountAchInvoice,
        as: 'invoices',

        include: [{
          model: models.Invoice,
          as: 'invoice',

          where: {
            status: {
            //
              [Op.ne]: 'unpaid'
            }
          }
        }]
      
      }]

    });

    achs = achs.sort((a, b) => {

      if (parseInt(a.batch.batch_id) > parseInt(b.batch.batch_id)) {

        return -1;

      } else {

        return 1;
      
      };

    });

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

