
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';

import { Op } from 'sequelize';

import * as moment from 'moment';

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

    if (!req.payload.batch_id) {
      throw new Error('batch_id required');
    }

    if (!req.payload.effective_date) {
      throw new Error('effective_date required');
    }

    let updatedRecord = await models.AchBatch.update({

      batch_id: req.payload.batch_id,

      effective_date: moment(req.payload.effective_date).toDate(),

    }, {

      where: {

        id: req.params.id,

        batch_id: { [Op.eq]: null }

      },

      returning: true

    });

    return { ach: updatedRecord };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

