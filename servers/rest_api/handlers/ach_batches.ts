
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

import { Op } from 'sequelize';

export async function index(req, h: ResponseToolkit) {

  try {

    let achs = await models.AchBatch.findAll({

      where: {
        account_id: req.account.id,
        effective_date: {
          [Op.ne]: null
        },
        amount: {
          [Op.gt]: 0
        }
      },

      order: [["effective_date", "desc"]]
    });

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

export async function show(req, h: ResponseToolkit) {

  try {

    let ach = await models.AchBatch.findOne({

      where: {
        account_id: req.account.id,
        id: req.params.id
      }

    });

    let invoices = await models.Invoice.findAll({
      where: {
        ach_batch_id: ach.id
      }
    })

    return { ach, invoices };

  } catch(error) {

    

    return Boom.badRequest(error.message)

  }

}

