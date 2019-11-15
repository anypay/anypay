
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models, accounts } from '../../../lib';

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

export async function enable(req: Request, h: ResponseToolkit){

  let account = await models.Account.findOne({where:{id:req.account.id}})

  if( account.ach_enabled ){
    Boom.badRequest('ACH already enabled for account');
  }

  account = await accounts.enableACH(req.account.id)

  return account;

}

export async function disable(req: Request, h: ResponseToolkit){
  
  let account = await models.Account.findOne({where:{id:req.account.id}})

  if( !account.ach_enabled ){
    Boom.badRequest('ACH already disabled for account');
  }

  account = await accounts.disableACH(req.account.id)

  return account;

}

