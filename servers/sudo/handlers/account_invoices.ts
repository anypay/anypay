
import * as Boom from 'boom';

import { models, log } from '../../../lib';

export async function show(req, h) { 

  let account = await models.Account.findOne({ where: { id: req.params.id }});

  if (!account) {

    let error = `no account found with id ${req.params.id}`;

    log.error(error)

    return Boom.badRequest(error);

  }

  return models.Invoice.findAll({

    where: { 
    
      account_id: req.params.id

    },

    order: [

      ['createdAt', 'DESC']

    ],

    limit: 100

  });

}

