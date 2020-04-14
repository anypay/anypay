
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models } from '../../../lib';
import * as wire from '../../../lib/wire';
import { sendEmail } from '../../../lib/email';

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

export async function show(req: Request, h: ResponseToolkit) {

  try {

    let ach_batch = await models.AchBatch.findOne({
      where: { id: req.params.ach_batch_id }
    });

    let invoices = await models.Invoice.findAll({ where: {
      ach_batch_id: req.params.ach_batch_id
    }});

    return { ach_batch, invoices };

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

    sendAchReport(req.params.id);

    return { ach: updatedRecord };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

async function sendAchReport(batch_id) {

  let report = await wire.buildAchBatchEmailReport(batch_id);

  await sendEmail('steven@anypayinc.com', '[ACH EMAIL TO SEND EGIFTER]', report);
  await sendEmail('derrick@anypayinc.com', '[ACH EMAIL TO SEND EGIFTER]', report);
  await sendEmail('brandon@anypayinc.com', '[ACH EMAIL TO SEND EGIFTER]', report);

}

