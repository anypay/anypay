
import { models, log } from '../../../lib';

import { Op } from 'sequelize'

import * as Boom from 'boom';

import * as moment from 'moment'

import { generateBatchForDate } from '../../../lib/ach'

async function createNewBatches() {

  let now = moment()

  let lastBatch = await models.AchBatch.findOne({
    where: {
      payments_date: {
        [Op.ne]: null 
      }
    },
    order: [['payments_date', 'DESC']]
  })

  try {

    // while the cursor is still one day or more greater than the latest batch
    while(moment(lastBatch.payments_date).toDate() < now.toDate()) {

      let nextDay = moment(lastBatch.payments_date).add(1, 'day')

      let { ach_batch } = await generateBatchForDate(nextDay.toDate())

      lastBatch = ach_batch

      log.info('ach.batch.create', lastBatch.toJSON())

    }

  } catch(error) {
 
    log.error(error.message)

  }

}

export async function index(req, h) {
  console.log('sudo ach batch')

  await createNewBatches()

  try {

    let resp = await  models.AchBatch.findAll({

      where: {
        payments_date: {
          [Op.ne]: null 
        }
      },

      order: [['payments_date', 'DESC']]

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

