
import { models, log } from '../../../lib';

import { Op } from 'sequelize'

import * as Boom from 'boom';

import * as moment from 'moment'

import { createNewBatches } from '../../../lib/ach'


export async function index(req, h) {
  console.log('sudo ach batch')

  let accounts = await models.Account.findAll({
    where: {
      should_settle: true
    }
  })

  for (let account of accounts) {

    await createNewBatches(account.id)

  }

  try {

    let resp = await  models.AchBatch.findAll({

      where: {
        payments_date: {
          [Op.ne]: null 
        }
      },

      order: [['payments_date', 'DESC']],

      include: [{
        model: models.Account,
        as: 'account',
        attributes: ['email', 'business_name', 'id']
      }]

    });

    return resp;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function create(req, h) {

  try {

    if (!req.payload.last_invoice_uid) {

      return Boom.badRequest('last_invoice_uid must be provided in payload');

    }

    let invoice = await models.Invoice.findOne({ where: {

      uid: req.payload.last_invoice_uid

    }});

    if (!invoice) {

      return Boom.badRequest('invoice not found for last_invoice_uid');

    }

    let ach_batch = await  models.AchBatch.create(req.payload);

    return { ach_batch };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

