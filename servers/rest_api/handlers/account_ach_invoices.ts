import { Request, ResponseToolkit } from 'hapi';
import { badRequest } from 'boom';
import { models } from '../../../lib';
import * as Sequelize from 'sequelize';

export async function show(req: Request, h: ResponseToolkit) {

  try {

    let account_ach = await models.AccountAch.findOne({

      where: {

        id: req.params.account_ach_id,

        account_id: req.account.id
      },

      include: [{

        model: models.AccountAchInvoice,

        as: 'invoices',

        include: [{

          model: models.Invoice,

          as: 'invoice',

          where: {
            status: {
              [Sequelize.Op.ne]: 'unpaid'
            }
          }

        }]

      },{

        model: models.AchBatch,

        as: 'batch'

      }]

    });

    if (!account_ach) { throw new Error(`account_ach not found`) }

    return {

      ach: account_ach

    }

  } catch(error) {

    return badRequest(error.message);

  }

}
