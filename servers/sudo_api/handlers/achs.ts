
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models,ach } from '../../../lib';

import * as moment from 'moment';
import * as Joi from 'joi';

export async function index(req: Request, h: ResponseToolkit) {

  try {
  
    var params;

    if (req.params && req.params.account_id) {

      params = { where: { account_id: req.params.account_id }};

    }

    let achs = await models.AccountAch.findAll(params);

    return { achs };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

export async function update(req: Request, h: ResponseToolkit) {

  try {

    let updatedRecord = await models.AchBatch.update({

      bank_batch_id: req.payload.batch_id,

    }, {

      where: {

        id: req.params.id,

        bank_batch_id: 0

      },

      returning: true

    });

    return { ach: updatedRecord };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}
