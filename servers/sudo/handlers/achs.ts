
import { Request, ResponseToolkit } from 'hapi';

import * as Boom from 'boom';

import { models, log } from '../../../lib';
import * as wire from '../../../lib/wire';

import { debitACH } from '../../../lib/anypayx'

import { sendAchReportEmail, createNextACH, handleCompletedACH } from '../../../lib/ach';

import { Op } from 'sequelize';

import * as moment from 'moment';

export async function create(req: Request, h: ResponseToolkit) {

  try {

    console.log('sudo.api.createNextAch');

    if (!req.payload.account_id) {

      throw new Error('account_id required in payload')

    }
  
    let { ach_batch, invoices } = await createNextACH(req.payload.account_id);

    return { ach_batch, invoices };

  } catch(error) {

    console.log(error);

    return Boom.badRequest(error.message)

  }

}

export async function index(req: Request, h: ResponseToolkit) {

  try {
  
    var params;

    if (req.params && req.params.account_id) {

      params = { where: { account_id: req.params.account_id }};

    }

    params['include'] = [{
      model: models.Account,
      attributes: ['email']
    }, {
      model: models.AchBatch,
      as: 'batch'
    }]

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

  log.info(Object.assign({ action: 'ach.update' }, req.payload)) 

  try {

    if (!req.payload.batch_id) {
      throw new Error('batch_id required');
    }

    if (!req.payload.effective_date) {
      throw new Error('effective_date required');
    }

    let update = {

      batch_id: req.payload.batch_id,

      effective_date: moment(req.payload.effective_date).toDate(),

      status: 'sent'

    }

    let where = {

      id: req.params.id,

      status: 'pending'

    }

    log.info('ach.update', {
      update, where
    })

    let updatedRecord = await models.AchBatch.update(update, {

      where,

      returning: true

    });

    console.log('record', updatedRecord)

    let ach_batch = await models.AchBatch.findOne({ where: { id: req.params.id }})

    let account = await models.Account.findOne({
      where: {
        id: ach_batch.account_id
      }
    })

    await sendAchReportEmail(ach_batch.id, account.email);

    debitACH(ach_batch.id)

    return { ach_batch };

  } catch(error) {

    return Boom.badRequest(error.message)

  }

}

